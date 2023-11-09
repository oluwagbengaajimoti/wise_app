@echo off

REM Install dependencies for wise holder
call npm install

REM Change directory to server holder and install dependencies
cd server
call npm install
cd ..

REM Change directory to client holder and install dependencies
cd client
call npm install
cd ..