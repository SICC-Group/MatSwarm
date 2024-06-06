import torch
import torch.nn as nn
import torch.nn.functional as F

from .base import BaseModel

class MLP(BaseModel):
    def __init__(self, input_size):
        super().__init__()
        self.relu = nn.ReLU()
        self.fc1 = nn.Linear(input_size, 32)
        self.fc2 = nn.Linear(32, 1)

        self.layer_shape = {k: v.shape for k, v in self.state_dict().items()}
        
    def forward(self, x):
        x = self.fc1(x)
        x = self.relu(x)
        x = self.fc2(x)
        return x
    
    def local_loss(self, predictions, targets):
        return self.mse_loss(predictions, targets)
        # if last_model:
        #     now_model = self.get_serializable_state_list(to_list=False)
        #     last_model = torch.tensor(last_model, dtype=torch.float32)
        #     prox_term = torch.sum((now_model - last_model) ** 2)
        #     loss_ = mse + ratio * prox_term
        # else:
        #     loss_ = mse
        
        # return loss_
