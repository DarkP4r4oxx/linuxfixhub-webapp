// Sample Linux issues data
export interface Issue {
  id: string
  title: string
  description: string
  distro: "Ubuntu" | "Arch" | "Fedora" | "Debian" | "Other"
  category: string
  tags: string[]
  stepsToFix: string
  commands: string[]
  upvotes: number
  createdAt: string
}

export interface Comment {
  id: string
  author: string
  text: string
  createdAt: string
}

export const CATEGORIES = ["Networking", "Boot Issues", "Audio", "Display", "Package Management", "System Errors"]

export const DISTROS = ["Ubuntu", "Arch", "Fedora", "Debian", "Other"]

export const initialIssues: Issue[] = [
  {
    id: "1",
    title: "No Sound Output on Ubuntu 22.04",
    description: "Audio is not working after fresh Ubuntu installation. Speakers are not detected.",
    distro: "Ubuntu",
    category: "Audio",
    tags: ["audio", "pulseaudio", "alsa"],
    stepsToFix: `1. Check if audio device is detected
2. Restart PulseAudio service
3. Check ALSA configuration
4. Update audio drivers if needed`,
    commands: ["aplay -l", "systemctl restart pulseaudio", "alsamixer"],
    upvotes: 24,
    createdAt: "2024-10-20",
  },
  {
    id: "2",
    title: "WiFi Not Connecting on Arch Linux",
    description: "WiFi adapter is recognized but cannot connect to networks.",
    distro: "Arch",
    category: "Networking",
    tags: ["wifi", "network", "driver"],
    stepsToFix: `1. Check if WiFi is enabled
2. Verify driver is loaded
3. Restart NetworkManager
4. Reconnect to network`,
    commands: ["rfkill list", "lsmod | grep -i wifi", "systemctl restart NetworkManager"],
    upvotes: 18,
    createdAt: "2024-10-19",
  },
  {
    id: "3",
    title: "Boot Hangs at GRUB on Fedora",
    description: "System hangs at GRUB menu during boot process.",
    distro: "Fedora",
    category: "Boot Issues",
    tags: ["grub", "boot", "kernel"],
    stepsToFix: `1. Boot into GRUB menu
2. Edit boot parameters
3. Remove quiet splash parameters
4. Boot and check logs`,
    commands: ["journalctl -b", "grub2-mkconfig -o /boot/grub2/grub.cfg"],
    upvotes: 12,
    createdAt: "2024-10-18",
  },
  {
    id: "4",
    title: "Package Manager Lock Error on Debian",
    description: "apt is locked and cannot install packages.",
    distro: "Debian",
    category: "Package Management",
    tags: ["apt", "package", "lock"],
    stepsToFix: `1. Wait for background updates to finish
2. Remove lock file if stuck
3. Update package lists
4. Try installation again`,
    commands: ["sudo rm /var/lib/apt/lists/lock", "sudo apt update", "sudo apt install -f"],
    upvotes: 31,
    createdAt: "2024-10-17",
  },
  {
    id: "5",
    title: "Screen Tearing in NVIDIA Driver",
    description: "Visual screen tearing when scrolling or moving windows.",
    distro: "Ubuntu",
    category: "Display",
    tags: ["nvidia", "display", "vsync"],
    stepsToFix: `1. Open NVIDIA Settings
2. Enable Force Full Composition Pipeline
3. Apply settings
4. Restart X server if needed`,
    commands: ["nvidia-settings", "xrandr --query"],
    upvotes: 22,
    createdAt: "2024-10-16",
  },
]
