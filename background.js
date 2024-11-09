browser.browserAction.onClicked.addListener((tab) => {
    console.log('Button clicked for tab:', tab.id);

    browser.tabs.sendMessage(tab.id, { action: "convert" })
    .then(response => {
        console.log('Response from content script:', response);
        
        if (!response.success) {
            console.error('Conversion failed:', response.error);
            return;
        }

        // Handle based on the action type
        if (response.action === 'clipboard') {
            // Nothing to do here as clipboard copying is handled in content script
            console.log('Content copied to clipboard');
        } else if (response.action === 'download' && response.markdownContent) {
            const blob = new Blob([response.markdownContent], { 
                type: response.fileName.endsWith('.txt') ? 'text/plain' : 'text/markdown'
            });
            const url = URL.createObjectURL(blob);

            return browser.downloads.download({
                url: url,
                filename: response.fileName,
                saveAs: false, // Changed from true to false
                conflictAction: 'uniquify' // Automatically adds numbers to avoid conflicts
            }).finally(() => {
                URL.revokeObjectURL(url);
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});
