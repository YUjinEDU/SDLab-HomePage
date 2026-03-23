#!/bin/bash
# ============================================================================
# SD Lab Server Monitor — Installation Script
#
# Copies files to /opt/sdlab-monitor/, installs Python dependencies,
# sets up the systemd service, and prompts for configuration values.
#
# Usage:
#   sudo bash install.sh
# ============================================================================

set -euo pipefail

INSTALL_DIR="/opt/sdlab-monitor"
SERVICE_NAME="sdlab-monitor"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# --------------------------------------------------------------------------
# Helpers
# --------------------------------------------------------------------------

info()  { echo -e "\033[1;32m[INFO]\033[0m  $*"; }
warn()  { echo -e "\033[1;33m[WARN]\033[0m  $*"; }
error() { echo -e "\033[1;31m[ERROR]\033[0m $*"; exit 1; }

# --------------------------------------------------------------------------
# Pre-checks
# --------------------------------------------------------------------------

if [ "$(id -u)" -ne 0 ]; then
    error "This script must be run as root (use sudo)."
fi

if ! command -v python3 &>/dev/null; then
    error "python3 is not installed."
fi

if ! command -v pip3 &>/dev/null && ! python3 -m pip --version &>/dev/null 2>&1; then
    error "pip3 is not installed. Install python3-pip first."
fi

# --------------------------------------------------------------------------
# Install files
# --------------------------------------------------------------------------

info "Creating installation directory: ${INSTALL_DIR}"
mkdir -p "${INSTALL_DIR}"

info "Copying agent files..."
cp "${SCRIPT_DIR}/agent.py"       "${INSTALL_DIR}/agent.py"
cp "${SCRIPT_DIR}/requirements.txt" "${INSTALL_DIR}/requirements.txt"

chmod 644 "${INSTALL_DIR}/agent.py"
chmod 644 "${INSTALL_DIR}/requirements.txt"

# --------------------------------------------------------------------------
# Install Python dependencies
# --------------------------------------------------------------------------

info "Installing Python dependencies..."
if command -v pip3 &>/dev/null; then
    pip3 install --quiet -r "${INSTALL_DIR}/requirements.txt"
else
    python3 -m pip install --quiet -r "${INSTALL_DIR}/requirements.txt"
fi

# --------------------------------------------------------------------------
# Configure config.env
# --------------------------------------------------------------------------

CONFIG_FILE="${INSTALL_DIR}/config.env"

if [ -f "${CONFIG_FILE}" ]; then
    warn "config.env already exists at ${CONFIG_FILE}."
    read -rp "Overwrite with fresh configuration? [y/N]: " overwrite
    if [[ ! "${overwrite}" =~ ^[Yy]$ ]]; then
        info "Keeping existing config.env."
    else
        rm -f "${CONFIG_FILE}"
    fi
fi

if [ ! -f "${CONFIG_FILE}" ]; then
    info "Setting up configuration..."
    echo ""

    read -rp "Supabase URL (e.g. https://xxx.supabase.co): " supabase_url
    read -rsp "Supabase Service Role Key: " supabase_key; echo
    read -rp "Server ID (UUID from servers table): " server_id
    read -rp "Collection interval in seconds [60]: " interval
    interval="${interval:-60}"
    read -rp "Disk usage paths (comma-separated) [/home]: " disk_paths
    disk_paths="${disk_paths:-/home}"
    read -rp "Disk usage scan interval in seconds [86400]: " disk_interval
    disk_interval="${disk_interval:-86400}"

    cat > "${CONFIG_FILE}" <<ENVEOF
SUPABASE_URL=${supabase_url}
SUPABASE_SERVICE_ROLE_KEY=${supabase_key}
SERVER_ID=${server_id}
COLLECTION_INTERVAL=${interval}
DISK_USAGE_PATHS=${disk_paths}
DISK_USAGE_INTERVAL=${disk_interval}
ENVEOF

    chmod 600 "${CONFIG_FILE}"
    info "config.env written to ${CONFIG_FILE} (mode 600)."
fi

# --------------------------------------------------------------------------
# Install systemd service
# --------------------------------------------------------------------------

SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"

info "Installing systemd service..."
cp "${SCRIPT_DIR}/sdlab-monitor.service" "${SERVICE_FILE}"
chmod 644 "${SERVICE_FILE}"

systemctl daemon-reload
systemctl enable "${SERVICE_NAME}.service"

info "Systemd service installed and enabled."

# --------------------------------------------------------------------------
# Start the service
# --------------------------------------------------------------------------

read -rp "Start the monitor service now? [Y/n]: " start_now
if [[ ! "${start_now}" =~ ^[Nn]$ ]]; then
    systemctl start "${SERVICE_NAME}.service"
    info "Service started."
    echo ""
    info "Check status with:  systemctl status ${SERVICE_NAME}"
    info "View logs with:     journalctl -u ${SERVICE_NAME} -f"
else
    info "Service not started. Start manually with:  systemctl start ${SERVICE_NAME}"
fi

echo ""
info "Installation complete!"
info "  Install dir : ${INSTALL_DIR}"
info "  Config file : ${CONFIG_FILE}"
info "  Service     : ${SERVICE_NAME}.service"
