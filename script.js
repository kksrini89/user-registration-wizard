const WIZARD_STEPS = [
    "step-account",
    "step-personal",
    "step-verification",
    "step-business",
    "step-security",
    "step-preferences",
    "step-review"
];
const STEP_CONFIG = {
    business : { totalSteps: 7},
    personal : { totalSteps: 6}
};

let currentStepIndex = 0;
let wizardData = {
    // Account Info
    email: "",
    username: "",
    accountType: "",
    password: "",
    confirmPassword: "",

    // Personal Details
    fullName: "",
    dob: "",
    gender: "",
    selectedState: "",

    // Verification
    otp: "",

    // Business
    companyName: "",
    companySize: "",
    hasOpsTeam: false,

    // Security
    password2: "",
    confirmPassword2: "",

    // Preferences
    newsletter: false,
    marketing: false,
    notifications: false,
    onboarding: false
};

const btnBack = document.getElementById("btn-back");
const btnNext = document.getElementById("btn-next");
const progressBar = document.getElementById("progressBar");
const stepCounter = document.getElementById("stepCounter");
const totalSteps = document.getElementById("totalSteps");

function updateUI() {
    // 1. Hide all steps
    WIZARD_STEPS.forEach(stepId => {
        document.getElementById(stepId).classList.add("d-none");
    });

    // 2. Show current step
    const currentStepId = WIZARD_STEPS[currentStepIndex];
    document.getElementById(currentStepId).classList.remove("d-none");

    // 3. Update step counter
    const visibleStepIndex = getCurrentVisibleStepIndex(currentStepIndex, wizardData.accountType);
    stepCounter.textContent = `Step ${visibleStepIndex}`;

    // 4. Update buttons
    btnBack.disabled = currentStepIndex === 0;
    btnNext.innerText = currentStepIndex === WIZARD_STEPS.length - 1 ? "Submit" : "Next →";

    // 5. Update progress bar
    const totalVisibleSteps = getVisibleStepsCount(wizardData.accountType);
    const progress = (visibleStepIndex / totalVisibleSteps) * 100;
    progressBar.style.width = `${progress}%`;

    // 6. If on review step, populate it
    if (currentStepIndex === WIZARD_STEPS.length - 1) {
        populateReviewStep();
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function goNext() {
    if (!validateCurrentStep()) {
        return;
    }

    // Save data from current step
    saveDataFromDOM();

    // If not on last step, move to next
    if (currentStepIndex < WIZARD_STEPS.length - 1) {
        currentStepIndex = getNextStepIndex(currentStepIndex, wizardData.accountType);
        updateUI();
    } else {
        submitForm();
    }
}

function goBack() {
    if (currentStepIndex > 0) {
        currentStepIndex = getPreviousStepIndex(currentStepIndex, wizardData.accountType);
        updateUI();
    }
}

function getNextStepIndex(currentStepIndex, accountType) {
    if(currentStepIndex === 2 && accountType === 'personal') {
        return 4;
    }
    return currentStepIndex + 1;
}

function getPreviousStepIndex(currentStepIndex, accountType) {
    if(currentStepIndex === 4 && accountType === 'personal') {
        return 2;
    }
    return currentStepIndex - 1;
}

function getVisibleStepsCount(accountType) {
    return STEP_CONFIG[accountType]?.totalSteps || 7;
}

function getCurrentVisibleStepIndex(currentStepIndex, accountType) {
    // Calculate user-facing step number (1-based)
    if (accountType === 'personal' && currentStepIndex > 3) {
        return currentStepIndex;  // After skipping business, same as index
    }
    if (accountType === 'personal' && currentStepIndex === 3) {
        return 3;  // Business step is skipped, so security shows as step 4
    }
    return currentStepIndex + 1;
}

function validateCurrentStep() {
    const stepId = WIZARD_STEPS[currentStepIndex];

    switch (stepId) {
        case "step-account":
            return validateAccountStep();
        case "step-personal":
            return validatePersonalStep();
        case "step-verification":
            return validateVerificationStep();
        case "step-business":
            return validateBusinessStep();
        case "step-security":
            return validateSecurityStep();
        case "step-preferences":
            return validatePreferencesStep();
        case "step-review":
            return true; // No validation on review
        default:
            return true;
    }
}

function validateAccountStep() {
    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const accountType = document.getElementById("account-type").value;
    const password = document.getElementById("password-step1").value;
    const confirmPassword = document.getElementById("confirm-password-step1").value;

    if (!email) {
        alert("Please enter an email address.");
        return false;
    }

    if (!email.includes("@")) {
        alert("Please enter a valid email address.");
        return false;
    }

    if (!username) {
        alert("Please enter a username.");
        return false;
    }

    if(!accountType) {
        alert("Select an account type!");
        return false;
    }

    if (!password) {
        alert("Please enter a password.");
        return false;
    }

    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return false;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return false;
    }

    return true;
}

function validatePersonalStep() {
    const fullName = document.getElementById("full-name").value.trim();
    const dob = document.getElementById("dob").value;
    const gender = document.getElementById("gender").value;
    const selectedState = wizardData.selectedState;

    if (!fullName) {
        alert("Please enter your full name.");
        return false;
    }

    if (!dob) {
        alert("Please select your date of birth.");
        return false;
    }

    if (!gender) {
        alert("Please select your gender.");
        return false;
    }

    if (!selectedState) {
        alert("Please select a state by clicking on the map.");
        return false;
    }

    return true;
}

function validateVerificationStep() {
    const otp = document.getElementById("otp").value.trim();

    if (!otp) {
        alert("Please enter the verification code.");
        return false;
    }

    if (!/^\d{6}$/.test(otp)) {
        alert("Verification code must be 6 digits.");
        return false;
    }

    return true;
}

function validateBusinessStep() {
    const companyName = document.getElementById("company-name").value.trim();
    const companySize = document.getElementById("company-size").value;

    if (!companyName) {
        alert("Please enter your company name.");
        return false;
    }

    if (!companySize) {
        alert("Please select a company size.");
        return false;
    }

    return true;
}

function validateSecurityStep() {
    const password = document.getElementById("password-step5").value;
    const confirmPassword = document.getElementById("confirm-password-step5").value;

    if (!password) {
        alert("Please enter a password.");
        return false;
    }

    if (password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return false;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return false;
    }

    return true;
}

function validatePreferencesStep() {
    // No validation, hence returning true to proceed further
    return true;
}

function saveDataFromDOM() {
    const stepId = WIZARD_STEPS[currentStepIndex];

    switch (stepId) {
        case "step-account":
            wizardData.email = document.getElementById("email").value.trim();
            wizardData.username = document.getElementById("username").value.trim();
            wizardData.accountType = document.getElementById("account-type").value;
            wizardData.password = document.getElementById("password-step1").value;
            wizardData.confirmPassword = document.getElementById("confirm-password-step1").value;
            break;

        case "step-personal":
            wizardData.fullName = document.getElementById("full-name").value.trim();
            wizardData.dob = document.getElementById("dob").value;
            wizardData.gender = document.getElementById("gender").value;
            // selectedState is already saved in handleMapClick
            break;

        case "step-verification":
            wizardData.otp = document.getElementById("otp").value.trim();
            break;

        case "step-business":
            wizardData.companyName = document.getElementById("company-name").value.trim();
            wizardData.companySize = document.getElementById("company-size").value;
            wizardData.hasOpsTeam = document.getElementById("has-ops-team").checked;
            break;

        case "step-security":
            wizardData.password2 = document.getElementById("password-step5").value;
            wizardData.confirmPassword2 = document.getElementById("confirm-password-step5").value;
            break;

        case "step-preferences":
            wizardData.newsletter = document.getElementById("newsletter").checked;
            wizardData.marketing = document.getElementById("marketing").checked;
            wizardData.notifications = document.getElementById("notifications").checked;
            wizardData.onboarding = document.getElementById("onboarding").checked;
            break;
    }
}

// To update the password strength
function updatePasswordStrength() {
    const password = document.getElementById("password-step5").value;
    const strengthMeter = document.getElementById("strength-meter");
    const strengthText = document.getElementById("strength-text");

    const strength = checkPasswordStrength(password);

    // Remove all strength classes
    strengthMeter.classList.remove("weak", "good", "strong");

    if (strength === "Weak") {
        strengthMeter.classList.add("weak");
        strengthText.textContent = "Weak";
        strengthText.style.color = "#dc3545";
    } else if (strength === "Good") {
        strengthMeter.classList.add("good");
        strengthText.textContent = "Good";
        strengthText.style.color = "#ffc107";
    } else if (strength === "Strong") {
        strengthMeter.classList.add("strong");
        strengthText.textContent = "Strong";
        strengthText.style.color = "#28a745";
    } else {
        strengthText.textContent = "--";
    }
}

// To check the password strength
function checkPasswordStrength(password) {
    if (!password) {
        return "None";
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasMinLength = password.length >= 8;

    if (hasUpperCase && hasNumber && hasMinLength) {
        return "Strong";
    } else if (hasMinLength || (hasUpperCase && hasNumber)) {
        return "Good";
    } else {
        return "Weak";
    }
}

function handleAccountTypeChange(event) {
    const accountType = event.target.value;
    const totalVisibleSteps = getVisibleStepsCount(accountType);
    totalSteps.textContent = totalVisibleSteps;
}

function handleMapClick(event) {
    if (!event.target.classList.contains("state-path")) {
        return;
    }

    // Remove selection from all states
    document.querySelectorAll(".state-path").forEach(path => {
        path.classList.remove("selected");
    });

    // Add selection to clicked state
    event.target.classList.add("selected");

    // Save state
    const stateName = event.target.getAttribute("data-state-name");
    wizardData.selectedState = stateName;

    // Update display
    document.getElementById("selected-state-text").textContent = stateName;
}

function handleCompanySizeChange() {
    const companySize = document.getElementById("company-size").value;
    const conditionalField = document.getElementById("conditional-ops-team");

    if (companySize === "51+") {
        conditionalField.classList.remove("d-none");
    } else {
        conditionalField.classList.add("d-none");
    }
}

function populateReviewStep() {
    const reviewContent = document.getElementById("review-content");

    const html = `
        <div class="review-card">
            <h5>Account Information</h5>
            <div class="review-item">
                <span class="review-label">Email:</span>
                <span class="review-value">${wizardData.email}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Username:</span>
                <span class="review-value">${wizardData.username}</span>
            </div>
        </div>

        <div class="review-card">
            <h5>Personal Details</h5>
            <div class="review-item">
                <span class="review-label">Full Name:</span>
                <span class="review-value">${wizardData.fullName}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Date of Birth:</span>
                <span class="review-value">${wizardData.dob}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Gender:</span>
                <span class="review-value">${wizardData.gender}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Selected State:</span>
                <span class="review-value">${wizardData.selectedState}</span>
            </div>
        </div>
${wizardData.accountType === 'business' ? `
        <div class="review-card">
            <h5>Business Details</h5>
            <div class="review-item">
                <span class="review-label">Company Name:</span>
                <span class="review-value">${wizardData.companyName}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Company Size:</span>
                <span class="review-value">${wizardData.companySize}</span>
            </div>
            ${wizardData.companySize === "51+" ? `
            <div class="review-item">
                <span class="review-label">Has Ops Team:</span>
                <span class="review-value">${wizardData.hasOpsTeam ? "Yes" : "No"}</span>
            </div>
            ` : ""}
        </div>` : "" }

        <div class="review-card">
            <h5>Communication Preferences</h5>
            <div class="review-item">
                <span class="review-label">Newsletter:</span>
                <span class="review-value">${wizardData.newsletter ? "Subscribed" : "Not subscribed"}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Marketing Emails:</span>
                <span class="review-value">${wizardData.marketing ? "Enabled" : "Disabled"}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Notifications:</span>
                <span class="review-value">${wizardData.notifications ? "Enabled" : "Disabled"}</span>
            </div>
            <div class="review-item">
                <span class="review-label">Onboarding Assistance:</span>
                <span class="review-value">${wizardData.onboarding ? "Requested" : "Not requested"}</span>
            </div>
        </div>
    `;

    reviewContent.innerHTML = html;
}

function submitForm() {
    console.log("Form Submitted!");
    console.log("Wizard Data:", wizardData);

    alert(
        "Registration completed successfully!\n\n" +
        "Name: " + wizardData.fullName + "\n" +
        "Email: " + wizardData.email + "\n" +
        "Company: " + wizardData.companyName + "\n\n" +
        "Check the console for full data."
    );
}

document.addEventListener("DOMContentLoaded", () => {
    totalSteps.textContent = WIZARD_STEPS.length;

    btnBack.addEventListener("click", goBack);
    btnNext.addEventListener("click", goNext);

    const passwordField5 = document.getElementById("password-step5");
    if (passwordField5) {
        passwordField5.addEventListener("input", updatePasswordStrength);
    }

    const companySizeSelect = document.getElementById("company-size");
    if (companySizeSelect) {
        companySizeSelect.addEventListener("change", handleCompanySizeChange);
    }

    const usMap = document.getElementById("us-map");
    if (usMap) {
        usMap.addEventListener("click", handleMapClick);
    }
    
    const accountTypeSelect = document.getElementById("account-type");
    if (accountTypeSelect) {
        accountTypeSelect.addEventListener("change", handleAccountTypeChange);
    }

    updateUI();
});