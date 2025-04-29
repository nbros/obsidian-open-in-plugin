import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, FileSystemAdapter } from 'obsidian';
import { exec } from "child_process"; // Import exec from Node.js

export default class OpenInPlugin extends Plugin {
	async onload() {
		this.addCommand({
			id: 'open-in-terminal',
			name: 'Open the current vault in a Windows Terminal',
			callback: () => this.openTerminal(),
		});
		this.addCommand({
			id: 'open-in-explorer',
			name: 'Open the current vault in Windows Explorer',
			callback: () => this.openExplorer(),
		});
	}

	onunload() { }

	openExplorer() {
		// Command for opening in Windows Explorer
		this.commandOnVault("start explorer");
	}

	openTerminal() {
		// Command for opening in Windows Terminal
		// wt.exe -d "directory" opens a new tab/window in the specified directory
		this.commandOnVault("wt.exe -d");
	}

	commandOnVault(commandLine: string) {
		// Check if the adapter is a FileSystemAdapter (desktop app)
		if (!(this.app.vault.adapter instanceof FileSystemAdapter)) {
			new Notice("This command is only available on the desktop version of Obsidian.");
			return;
		}

		// Get the vault's absolute base path
		const vaultPath = this.app.vault.adapter.getBasePath();

		// build command (wrap the path in quotes to handle spaces)
		const command = `${commandLine} "${vaultPath}"`;

		console.debug(`Executing command: ${command}`);

		// Execute the command
		exec(command, (error, stdout, stderr) => {
			if (error) {
				console.error(`Failed to open Windows Terminal: (RC ${error.code}) ${error.message}`);
				new Notice(`Failed to open Windows Terminal: (RC ${error.code}) ${error.message}`,);
				return;
			}
			if (stderr) {
				console.error(`stderr: ${stderr}`);
			}
			if (stdout) {
				console.debug(`stdout: ${stdout}`);
			}

			new Notice(`Opened in Windows Terminal.`);
		});
	}
}
