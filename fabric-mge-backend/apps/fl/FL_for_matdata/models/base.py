import torch
import torch.nn as nn
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class BaseModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.layer_shape = None
        self.mse_loss = nn.MSELoss()
        self.mae_loss = nn.L1Loss()
    
    def local_loss(self, predictions, targets):
        return self.mse_loss(predictions, targets)
        
    def load_serializable_state_list(
        self,
        serializable_state_list: list
    ):
        if self.layer_shape == None:
            raise ValueError("layer_shape is not initialized")
        pointer = 0
        for param in self.parameters():
            num_param = param.numel()
            param_data = serializable_state_list[pointer:pointer + num_param]
            param_data = torch.tensor(param_data, dtype=torch.float32,device=device)
            param.data = param_data.reshape(param.shape)
            pointer += num_param


    def get_serializable_state_list(self, to_list=True):
        params_list = [param.view(-1) for param in self.parameters()]
        if to_list:
            return torch.cat(params_list).tolist()
        else:
            return torch.cat(params_list)