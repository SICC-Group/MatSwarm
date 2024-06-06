sudo docker rm -f $(sudo docker ps -a| grep 'hyperledger' | awk '{print $1}')
sudo docker rm -f $(sudo docker ps -a| grep 'chaincode' | awk '{print $1}')
sudo docker network rm $(sudo docker network ls | grep 'test' | awk '{print $2}')
sudo docker volume prune
sudo docker volume rm $(sudo docker volume ls | grep  'fix' | awk '{print $2}')
cd fixtures && docker-compose up -d