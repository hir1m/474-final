echo "installing node modules..."
cd auth
yarn install
cd ..
cd course
yarn install
cd ..
cd enrollment
yarn install
cd ..

echo "building..."
cd auth
yarn build
cd ..
cd course
yarn build
cd ..
cd enrollment
yarn build
cd ..

echo "complete"