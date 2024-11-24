#!/bin/bash

GIT_BASE_URI="https://github.com/anmol-fzr"

FEE_CHECKRER_DIR="FeeCheckrer"
FEE_CHECKRER_URL="$GIT_BASE_URI/$FEE_CHECKRER_DIR"

FEE_MAILER_DIR="FeeMailer"
FEE_MAILER_URL="$GIT_BASE_URI/$FEE_MAILER_DIR"

FEE_GIVER_DIR="FeeGiver"
FEE_GIVER_URL="$GIT_BASE_URI/$FEE_GIVER_DIR"

DOCKER_COMPOSE_FILE="docker-compose.yaml"

clone_repo() {
  local url="$1"

  git clone "$url"
  if [[ $? -ne 0 ]]; then
    echo "Error: Failed to clone repository '$url'."
    echo "  - Check your internet connection."
    echo "  - Verify the repository URL is correct."
    echo "  - You may need to install Git (e.g., 'sudo apt install git' on Ubuntu)."
    return 1
  fi
}

echo "Cloning repositories..."
if ! clone_repo "$FEE_CHECKRER_URL" "$FEE_CHECKRER_DIR"; then
  exit 1
fi
if ! clone_repo "$FEE_MAILER_URL" "$FEE_MAILER_DIR"; then
  echo "Warning: FeeMailer failed to clone. Skipping..."
fi
if ! clone_repo "$FEE_GIVER_URL" "$FEE_GIVER_DIR"; then
  exit 1
fi

echo "Copying docker-compose.yaml..."
if ! cp "$FEE_CHECKRER_DIR/$DOCKER_COMPOSE_FILE" ..; then
  echo "Error: Failed to copy docker-compose.yaml."
  echo "  - Make sure the file exists in the FeeCheckrer directory."
  echo "  - Check permissions for copying the file."
  exit 1
fi


if ! docker ps -q; then
  echo "Docker is not running. Please start Docker and press 'y' to continue:"
  read -p "Press 'y' to continue: " input
  if [[ "$input" != "y" ]]; then
    echo "Press y once docker engine is started properly"
  fi
fi

echo "Docker is running. Continuing with the script..."

echo "Starting Docker containers..."
docker-compose up -d
if [[ $? -ne 0 ]]; then
  echo "Error: Failed to start Docker containers."
  echo "  - Check for errors in the docker-compose.yaml file."
  echo "  - Ensure Docker Engine is running and accessible."
  echo "  - Verify that the images referenced in docker-compose.yaml are available."
fi

echo "FeeCheckrer setup is complete!"
