#!/bin/bash
# Quick start script - runs both server and client

echo "Starting PixiHero Multiplayer Game..."
echo ""
echo "Starting WebSocket signaling server..."
node server.js &
SERVER_PID=$!

sleep 2

echo ""
echo "Starting Vite development server..."
npm run dev &
CLIENT_PID=$!

echo ""
echo "========================================="
echo "PixiHero Multiplayer is running!"
echo "========================================="
echo ""
echo "Signaling Server: ws://localhost:8080"
echo "Game Client: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Trap Ctrl+C and kill both processes
trap "kill $SERVER_PID $CLIENT_PID; exit" INT

# Wait for both processes
wait
