import torch
import torch.nn as nn

from .base import BaseModel, device


class LSTM(BaseModel):
    def __init__(self, input_size, hidden_size=16, num_layers=2):
        super().__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True)
        self.fc = nn.Linear(hidden_size, 1)

        self.layer_shape = {k: v.shape for k, v in self.state_dict().items()}

    def forward(self, x):
        self.lstm.flatten_parameters()
        h0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size, device=device)
        c0 = torch.zeros(self.num_layers, x.size(0), self.hidden_size, device=device)
        x = x.unsqueeze(1)
        x, _ = self.lstm(x, (h0, c0))
        x = self.fc(x[:, -1, :])
        return x

    def local_loss(self, predictions, targets):
        return self.mse_loss(predictions, targets)
