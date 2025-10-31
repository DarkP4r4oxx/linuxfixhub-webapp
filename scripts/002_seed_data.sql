-- Insert sample issues
INSERT INTO public.issues (title, description, distro, category, tags, steps_to_fix, commands, upvotes, created_at) VALUES
('No Sound Output on Ubuntu 22.04', 'Audio is not working after fresh Ubuntu installation. Speakers are not detected.', 'Ubuntu', 'Audio', ARRAY['audio', 'pulseaudio', 'alsa'], '1. Check if audio device is detected
2. Restart PulseAudio service
3. Check ALSA configuration
4. Update audio drivers if needed', ARRAY['aplay -l', 'systemctl restart pulseaudio', 'alsamixer'], 24, NOW() - INTERVAL '5 days'),
('WiFi Not Connecting on Arch Linux', 'WiFi adapter is recognized but cannot connect to networks.', 'Arch', 'Networking', ARRAY['wifi', 'network', 'driver'], '1. Check if WiFi is enabled
2. Verify driver is loaded
3. Restart NetworkManager
4. Reconnect to network', ARRAY['rfkill list', 'lsmod | grep -i wifi', 'systemctl restart NetworkManager'], 18, NOW() - INTERVAL '4 days'),
('Boot Hangs at GRUB on Fedora', 'System hangs at GRUB menu during boot process.', 'Fedora', 'Boot Issues', ARRAY['grub', 'boot', 'kernel'], '1. Boot into GRUB menu
2. Edit boot parameters
3. Remove quiet splash parameters
4. Boot and check logs', ARRAY['journalctl -b', 'grub2-mkconfig -o /boot/grub2/grub.cfg'], 12, NOW() - INTERVAL '3 days'),
('Package Manager Lock Error on Debian', 'apt is locked and cannot install packages.', 'Debian', 'Package Management', ARRAY['apt', 'package', 'lock'], '1. Wait for background updates to finish
2. Remove lock file if stuck
3. Update package lists
4. Try installation again', ARRAY['sudo rm /var/lib/apt/lists/lock', 'sudo apt update', 'sudo apt install -f'], 31, NOW() - INTERVAL '2 days'),
('Screen Tearing in NVIDIA Driver', 'Visual screen tearing when scrolling or moving windows.', 'Ubuntu', 'Display', ARRAY['nvidia', 'display', 'vsync'], '1. Open NVIDIA Settings
2. Enable Force Full Composition Pipeline
3. Apply settings
4. Restart X server if needed', ARRAY['nvidia-settings', 'xrandr --query'], 22, NOW() - INTERVAL '1 day');
