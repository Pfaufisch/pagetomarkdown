async function saveOptions(e) {
    e.preventDefault();
    const selectedAction = document.querySelector('input[name="defaultAction"]:checked').value;
    
    const settings = {
        defaultAction: selectedAction,
        filetype: selectedAction === 'download'
            ? document.querySelector("#filetype").value
            : null
    };

    console.log('Saving settings:', settings);
    await browser.storage.sync.set(settings);

    // Show save confirmation
    const button = document.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.textContent = 'Saved!';
    button.disabled = true;
    
    // Reset button after 1 second
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, 1000);
}

async function restoreOptions() {
    // Restore user settings
    const res = await browser.storage.sync.get({
        defaultAction: 'copyToClipboard',
        filetype: 'md'
    });

    console.log('Restored settings:', res);

    // Set default action
    const radioButton = document.querySelector(`input[value="${res.defaultAction}"]`);
    if (radioButton) {
        radioButton.checked = true;
    } else {
        // Fallback to copyToClipboard if no valid option is found
        document.querySelector('input[value="copyToClipboard"]').checked = true;
    }

    // Set filetype and visibility
    const filetypeSettings = document.querySelector("#filetypeSettings");
    if (res.defaultAction === 'download') {
        filetypeSettings.style.display = 'block';
        document.querySelector("#filetype").value = res.filetype || 'md';
    } else {
        filetypeSettings.style.display = 'none';
    }
}

function handleDefaultActionChange(e) {
    const filetypeSettings = document.querySelector("#filetypeSettings");
    
    if (e.target.value === 'download') {
        filetypeSettings.style.display = 'block';
        // Set filetype to md by default when switching to download
        document.querySelector("#filetype").value = 'md';
    } else {
        filetypeSettings.style.display = 'none';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
document.querySelectorAll(".actionOption").forEach(radio => {
    radio.addEventListener("change", handleDefaultActionChange);
});
