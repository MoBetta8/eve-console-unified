import json

config = {
    'audio': {'sample_rate': 22050},
    'espeak': {'voice': 'en-us'},
    'inference': {'noise_scale': 0.667, 'length_scale': 1.0, 'noise_w': 0.8},
    'num_symbols': 256
}

with open(r'C:\digimaster_assistant\voices\en_US-lessac-medium.onnx.json', 'w') as f:
    json.dump(config, f, indent=2)

print('JSON config created successfully for lessac voice!')