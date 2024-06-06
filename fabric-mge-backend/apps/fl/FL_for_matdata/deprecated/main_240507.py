import json
import numpy as np
import pandas as pd
import torch
import torch.nn as nn

from models import *
from utils import *
from config import args


if __name__ == '__main__':

    args = args.parse_args()
    torch.manual_seed(args.seed)
    np.random.seed(args.seed)

    # create the save path
    current_file_path = os.path.abspath(__file__)
    current_dir_path = os.path.dirname(current_file_path)
    res_path = os.path.join(current_dir_path, "results")
    save_path = make_training_save_path(res_path)
    if not os.path.exists(save_path):
        os.makedirs(save_path)
    
    save_config(save_path, vars(args))
    
    # choose device / model / optimizer
    # device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    device = torch.device("cpu")

    df_train = pd.read_csv(args.train_data_path)
    df_test = pd.read_csv(args.test_data_path)
    x, train_loader, test_loader = prepare_data(df_train=df_train, df_test=df_test, batch_size=args.batch_size)
    
    selected_model = globals().get(args.model)
    if selected_model:
        model = selected_model(input_size=x.shape[1]).to(device)
    else:
        raise NotImplementedError(f"Model {args.model} is not implemented")
    
    if args.optimizer == "adam":
        optimizer = torch.optim.Adam(model.parameters(), lr=args.lr)
    elif args.optimizer == "sgd":
        optimizer = torch.optim.SGD(model.parameters(), lr=args.lr)
    else:
        raise NotImplementedError(f"Optimizer {args.optimizer} is not implemented")

    # ### save the model file ###
    # torch.save(model.state_dict(), "./init_models/Lasso.pth")
    # ### load the model file in backend ###
    # model.load_state_dict(torch.load("./init_models/Lasso.pth"))

    # training details    
    epochs =  args.global_epochs # should be same in all the orgs
    avg_loss = []
    serializable_state_dict = None
    
    model.train()
    for epoch in range(epochs):
        # # set the local model with the latest model params before local training
        # # should be serializable_state_dict = get_from_blockchain()
        # if serializable_state_dict is not None:
        #     model.load_serializable_state_list(serializable_state_dict)
        
        losses = []
        # local training
        for x_batch, y_batch in train_loader:
            optimizer.zero_grad()
            predictions = model(x_batch)
            loss = model.loss(predictions, y_batch)
            loss.backward()
            optimizer.step()
            
            losses.append(loss.item())
        avg_loss.append(sum(losses) / len(losses))
        
        if (epoch+1) % (epochs/10) == 0:
            print("Epoch [{} / {}], {} Loss: {:.6f}".format(
                epoch + 1, epochs, model.__class__.__name__, avg_loss[-1] 
            ))

        # # save the local model for aggregation
        # state_dict = model.state_dict()
        # serializable_state_dict = {
        #     k: v.reshape(-1).tolist() for k, v in state_dict.items()
        # }
        # # json_str = json.dumps(serializable_state_dict)
        # # print(json_str)

        # # with open('the path we need', 'w') as json_file:
        # #     json.dump(serializable_state_dict, json_file)
        # # submit_to_SC_in_transaction(json_data)  ## file or string?

    test_and_record(save_path, avg_loss, model, test_loader, x)
    