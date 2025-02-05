const os = require("os");

function getIPAddress() {
  const interfaces = os.networkInterfaces();
  let preferredIP = "127.0.0.1"; // Default fallback

  for (const interfaceName in interfaces) {
    for (const iface of interfaces[interfaceName]) {
      if (!iface.internal && iface.family === "IPv4") {
        // Prioritize Wi-Fi or Ethernet over virtual adapters
        if (
          interfaceName.toLowerCase().includes("wi-fi") ||
          interfaceName.toLowerCase().includes("wlan")
        ) {
          return iface.address; // Prefer Wi-Fi
        }
        if (interfaceName.toLowerCase().includes("ethernet")) {
          preferredIP = iface.address; // Use Ethernet if no Wi-Fi found
        }
      }
    }
  }
  return preferredIP;
}

console.log("Machine IP:", getIPAddress());

module.exports = getIPAddress;
