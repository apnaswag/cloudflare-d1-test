let currentStep = 1;
const totalSteps = 3;

function updateProgress() {
    const progressBar = document.getElementById('progressBar');
    const percent = (currentStep / totalSteps) * 100;
    progressBar.style.width = percent + '%';
}

function validateStep(step) {
    const stepEl = document.getElementById(`step${step}`);
    const inputs = stepEl.querySelectorAll('input, select');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value) {
            isValid = false;
            input.style.borderColor = "#ef4444";
        } else {
            input.style.borderColor = "#ccc";
        }
    });
    return isValid;
}

function nextStep(step) {
    if (!validateStep(step)) return;

    document.getElementById(`step${step}`).classList.remove('active');
    currentStep++;
    document.getElementById(`step${currentStep}`).classList.add('active');
    updateProgress();
}

function prevStep(step) {
    document.getElementById(`step${step}`).classList.remove('active');
    currentStep--;
    document.getElementById(`step${currentStep}`).classList.add('active');
    updateProgress();
}

async function submitForm() {
    if (!validateStep(3)) return;

    const btn = document.querySelector('.btn-submit');
    const errorMsg = document.getElementById('errorMsg');
    
    // Disable button to prevent double submit
    btn.disabled = true;
    btn.innerText = "Submitting...";
    errorMsg.innerText = "";

    // Gather data
    const dob = `${document.getElementById('dob_dd').value}-${document.getElementById('dob_mm').value}-${document.getElementById('dob_yyyy').value}`;
    
    const formData = {
        name: document.getElementById('name').value,
        dob: dob,
        email: document.getElementById('email').value,
        pincode: document.getElementById('pincode').value,
        state: document.getElementById('state').value,
        qualification: document.getElementById('qualification').value,
        percent_cgpa: document.getElementById('marks').value
    };

    try {
        const response = await fetch('/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.status === 200) {
            // Success: Show step 4
            document.getElementById('step3').classList.remove('active');
            document.getElementById('step4').classList.add('active');
            document.getElementById('progressBar').style.width = '100%';
            document.getElementById('progressBar').style.backgroundColor = '#22c55e';
        } else if (response.status === 409) {
            errorMsg.innerText = "Error: Email already registered.";
            btn.disabled = false;
            btn.innerText = "Submit";
        } else {
            throw new Error(result.error || "Unknown error");
        }
    } catch (error) {
        console.error(error);
        errorMsg.innerText = "Submission failed. Please try again.";
        btn.disabled = false;
        btn.innerText = "Submit";
    }
}