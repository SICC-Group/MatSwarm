import torch
import torch.nn as nn

from .base import BaseModel

class Lasso(BaseModel):
    def __init__(self, input_size, alpha=0.01):
        super().__init__()
        self.alpha = alpha
        self.fc = nn.Linear(input_size, 1)
        
        self.layer_shape = {k: v.shape for k, v in self.state_dict().items()}
        
    def forward(self, x):
        return self.fc(x)
    
    def local_loss(self, predictions, targets):
        mse = self.mse_loss(predictions, targets)
        l1_loss = torch.norm(self.fc.weight, p=1)

        return mse / 2 + self.alpha + l1_loss
