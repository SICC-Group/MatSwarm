git pull
cd /opt/www/sites/mgedata-frontend
rm -rf ./dist/static

#yarn
#yarn run dll-dist
#yarn run dist

npm install
npm run dll-dist
npm run dist


cd /opt/www/sites/mgedata
python manage.py collectstatic
