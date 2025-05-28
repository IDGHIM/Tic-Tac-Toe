sudo docker image build -t tictactoe:latest .
sudo docker run -dp 8000:3000 --name tictatctoe tictactoe:latest