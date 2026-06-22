/* ==========================================================================
   FEDVISION LANDING PAGE INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- MOBILE MENU TOGGLE ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });
    }

    // --- INTERACTIVE TCO CALCULATOR ---
    const slider = document.getElementById('camera-slider');
    const cameraCountLabel = document.getElementById('camera-count');
    
    // Outputs
    const cloudGpuLabel = document.getElementById('cloud-gpu-cost');
    const cloudStorageLabel = document.getElementById('cloud-storage-cost');
    const cloudBandwidthLabel = document.getElementById('cloud-bandwidth-cost');
    const cloudTotalLabel = document.getElementById('cloud-total');
    
    const edgeHardwareLabel = document.getElementById('edge-hardware-cost');
    const edgeBandwidthLabel = document.getElementById('edge-bandwidth-cost');
    const edgeTotalLabel = document.getElementById('edge-total');
    
    const savingsLabel = document.getElementById('savings-val');

    function calculateTCO() {
        if (!slider) return;
        const cameras = parseInt(slider.value);
        cameraCountLabel.textContent = cameras;

        // --- Traditional Cloud AI Equations (5-Year Total in Lakhs) ---
        // For N=50: GPU=45L, Storage=18L, Bandwidth=22.5L, Total=85.5L
        const cloudGpu = cameras * 0.9;
        const cloudStorage = cameras * 0.36;
        const cloudBandwidth = cameras * 0.45;
        const cloudTotal = cloudGpu + cloudStorage + cloudBandwidth;

        // --- FedVision Equations (5-Year Total in Lakhs) ---
        // 1 Edge Gateway handles up to 10 cameras, costs ₹1 Lakh one-time.
        const gatewayBoxes = Math.ceil(cameras / 10);
        const edgeHardware = gatewayBoxes * 1.0; 
        
        // 5G SIM plan (OpEx) is ₹0.36 Lakhs per gateway box over 5 years.
        const edgeBandwidth = gatewayBoxes * 0.36;
        
        // Software License + AMC (5-Year) is ₹3.2 Lakhs per site deployment baseline
        const softwareAndAmc = 2.2;
        const edgeTotal = edgeHardware + edgeBandwidth + softwareAndAmc;

        // --- Net Savings ---
        const savings = cloudTotal - edgeTotal;

        // Update DOM Labels (Formatted to 1 decimal place)
        cloudGpuLabel.textContent = cloudGpu.toFixed(1);
        cloudStorageLabel.textContent = cloudStorage.toFixed(1);
        cloudBandwidthLabel.textContent = cloudBandwidth.toFixed(1);
        cloudTotalLabel.textContent = cloudTotal.toFixed(1);

        edgeHardwareLabel.textContent = edgeHardware.toFixed(1);
        edgeBandwidthLabel.textContent = edgeBandwidth.toFixed(1);
        edgeTotalLabel.textContent = edgeTotal.toFixed(1);

        savingsLabel.textContent = savings.toFixed(1);
    }

    if (slider) {
        slider.addEventListener('input', calculateTCO);
        calculateTCO(); // Run initial calculation on load
    }

    // --- ARCHITECTURE TAB SWITCHER & SIMULATIONS ---
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.arch-content');
    
    // Sim State Variables
    let trainingProgress = 0;
    let currentEpoch = 1;
    let globalState = 0;
    let stateTimeRemaining = 0;

    const epochCounter = document.getElementById('epoch-counter');
    const progressFill = document.getElementById('training-progress-fill');

    if (tabButtons.length > 0) {
        tabButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');

                // Remove active classes
                tabButtons.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                // Add active classes
                btn.classList.add('active');
                const targetElement = document.getElementById(`tab-${targetTab}`);
                if (targetElement) targetElement.classList.add('active');

                // Reset simulations on tab change to start fresh
                if (targetTab === 'edge') {
                    trainingProgress = 0;
                    currentEpoch = 1;
                    if (epochCounter) epochCounter.textContent = "Epoch 1/3";
                    if (progressFill) progressFill.style.width = "0%";
                } else if (targetTab === 'cloud') {
                    globalState = 0;
                    stateTimeRemaining = 0;
                }
            });
        });
    }

    // 1. Edge Node Inference & Training Simulator
    const tabEdge = document.getElementById('tab-edge');
    const telemetryLog = document.getElementById('telemetry-log');
    const simBox1 = document.getElementById('sim-box-1');
    const simBox2 = document.getElementById('sim-box-2');
    
    const inferenceLogs = [
        { text: "[Inference] Person detected (94.2%)", action: "[Action] Video Annihilated (DPDP Compliant)", warn: false },
        { text: "[Inference] Vehicle detected (88.7%)", action: "[Action] Video Annihilated (DPDP Compliant)", warn: false },
        { text: "[Inference] Low contrast person (61.5%)", action: "[Active Learning] Confusion Zone! Saved", warn: true },
        { text: "[Inference] Bike detected (91.0%)", action: "[Action] Video Annihilated (DPDP Compliant)", warn: false }
    ];
    let logIndex = 0;

    function runEdgeSimulation() {
        if (!tabEdge || !tabEdge.classList.contains('active')) return;

        // Progress training progress bar
        trainingProgress += 2;
        if (trainingProgress >= 100) {
            trainingProgress = 0;
            currentEpoch++;
            if (currentEpoch > 3) currentEpoch = 1;
            if (epochCounter) epochCounter.textContent = `Epoch ${currentEpoch}/3`;
        }
        if (progressFill) progressFill.style.width = `${trainingProgress}%`;
    }

    // Telemetry log and box trigger (slower interval)
    function runEdgeLogsSimulation() {
        if (!tabEdge || !tabEdge.classList.contains('active')) return;

        // Update boxes randomly to simulate detection shifts
        if (simBox1 && simBox2) {
            const r = Math.random();
            if (r < 0.3) {
                simBox1.style.display = 'block';
                simBox2.style.display = 'none';
                simBox1.textContent = `Person: ${(90 + Math.random() * 9).toFixed(0)}%`;
            } else if (r < 0.6) {
                simBox1.style.display = 'none';
                simBox2.style.display = 'block';
                simBox2.textContent = `Car: ${(85 + Math.random() * 10).toFixed(0)}%`;
            } else {
                simBox1.style.display = 'block';
                simBox2.style.display = 'block';
                simBox1.textContent = `Person: ${(92 + Math.random() * 7).toFixed(0)}%`;
                simBox2.textContent = `Car: ${(87 + Math.random() * 8).toFixed(0)}%`;
            }
        }

        // Add log lines
        if (telemetryLog) {
            const entry = inferenceLogs[logIndex];
            logIndex = (logIndex + 1) % inferenceLogs.length;

            const actionClass = entry.warn ? "log-warn" : "log-success";
            telemetryLog.innerHTML = `
                <div class="log-line">${entry.text}</div>
                <div class="log-line ${actionClass}">${entry.action}</div>
            `;
        }
    }

    // Run Edge Node simulation ticks
    setInterval(runEdgeSimulation, 100);
    setInterval(runEdgeLogsSimulation, 2000);


    // 2. Global Federated Learning Orchestrator State Machine
    const tabCloud = document.getElementById('tab-cloud');
    const serverNode = document.getElementById('global-server-node');
    const serverStatus = document.getElementById('global-server-status');
    const edgeBox1 = document.getElementById('global-edge-1');
    const edgeBox2 = document.getElementById('global-edge-2');
    
    // Upward pulses (SVG circles)
    const pulseUpL = document.getElementById('pulse-up-l');
    const pulseUpR = document.getElementById('pulse-up-r');
    const animUpL = document.getElementById('anim-up-l');
    const animUpR = document.getElementById('anim-up-r');
    
    // Downward pulses (SVG circles)
    const pulseDownL = document.getElementById('pulse-down-l');
    const pulseDownR = document.getElementById('pulse-down-r');
    const animDownL = document.getElementById('anim-down-l');
    const animDownR = document.getElementById('anim-down-r');

    function runGlobalSimulation() {
        if (!tabCloud || !tabCloud.classList.contains('active')) return;

        if (stateTimeRemaining > 0) {
            stateTimeRemaining--;
            return;
        }

        switch(globalState) {
            case 0: // Prepare/Idle -> Go to Uploading
                if (serverStatus) serverStatus.textContent = "Awaiting weights updates...";
                if (serverNode) serverNode.classList.remove('active-aggregation', 'active-broadcast');
                if (edgeBox1 && edgeBox2) {
                    edgeBox1.classList.remove('success-flash');
                    edgeBox2.classList.remove('success-flash');
                }
                if (pulseUpL && pulseUpR) {
                    pulseUpL.setAttribute('opacity', '0');
                    pulseUpR.setAttribute('opacity', '0');
                }
                if (pulseDownL && pulseDownR) {
                    pulseDownL.setAttribute('opacity', '0');
                    pulseDownR.setAttribute('opacity', '0');
                }
                globalState = 1;
                stateTimeRemaining = 5; // 1s wait
                break;
                
            case 1: // Uploading weights -> Go to Aggregating
                if (serverStatus) serverStatus.textContent = "Uploading weights (gRPC)...";
                if (pulseUpL && pulseUpR && animUpL && animUpR) {
                    pulseUpL.setAttribute('opacity', '1');
                    pulseUpR.setAttribute('opacity', '1');
                    animUpL.beginElement();
                    animUpR.beginElement();
                }
                globalState = 2;
                stateTimeRemaining = 6; // 1.2s travel time
                break;
                
            case 2: // Aggregating (FedAvg) -> Go to Broadcasting
                if (serverStatus) serverStatus.textContent = "Aggregating (FedAvg)...";
                if (serverNode) serverNode.classList.add('active-aggregation');
                if (pulseUpL && pulseUpR) {
                    pulseUpL.setAttribute('opacity', '0');
                    pulseUpR.setAttribute('opacity', '0');
                }
                globalState = 3;
                stateTimeRemaining = 10; // 2s processing time
                break;
                
            case 3: // Broadcasting model weights -> Go to Success
                if (serverStatus) serverStatus.textContent = "Broadcasting global model...";
                if (serverNode) {
                    serverNode.classList.remove('active-aggregation');
                    serverNode.classList.add('active-broadcast');
                }
                if (pulseDownL && pulseDownR && animDownL && animDownR) {
                    pulseDownL.setAttribute('opacity', '1');
                    pulseDownR.setAttribute('opacity', '1');
                    animDownL.beginElement();
                    animDownR.beginElement();
                }
                globalState = 4;
                stateTimeRemaining = 6; // 1.2s travel time
                break;
                
            case 4: // Success / Flash edges -> Go to Idle
                if (serverStatus) serverStatus.textContent = "Sync Complete. Model Hot-Swapped!";
                if (serverNode) serverNode.classList.remove('active-broadcast');
                if (pulseDownL && pulseDownR) {
                    pulseDownL.setAttribute('opacity', '0');
                    pulseDownR.setAttribute('opacity', '0');
                }
                if (edgeBox1 && edgeBox2) {
                    edgeBox1.classList.add('success-flash');
                    edgeBox2.classList.add('success-flash');
                }
                globalState = 0;
                stateTimeRemaining = 10; // 2s show success
                break;
        }
    }

    // Tick global simulation cycle every 200ms
    setInterval(runGlobalSimulation, 200);

    // --- CONTACT FORM SUBMISSION ---
    const contactForm = document.getElementById('contact-form');
    const formSuccessMsg = document.getElementById('form-success');

    if (contactForm && formSuccessMsg) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Handle button loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = "Sending...";
            submitBtn.disabled = true;

            const nameVal = document.getElementById('name').value;
            const orgVal = document.getElementById('org').value;
            const emailVal = document.getElementById('email').value;
            const phoneVal = document.getElementById('phone').value;
            const messageVal = document.getElementById('message').value;

            // Replace 'YOUR_ACCESS_KEY_HERE' with your real Web3Forms access key.
            // Get your free key instantly at https://web3forms.com
            const accessKey = "e1081c39-fc20-410e-96f7-5bf652ae790d"; 

            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    access_key: accessKey,
                    name: nameVal,
                    organization: orgVal,
                    email: emailVal,
                    phone: phoneVal,
                    message: messageVal,
                    subject: "New FedVision Pilot Request"
                })
            })
            .then(async (response) => {
                const json = await response.json();
                if (response.status === 200) {
                    // Transition UI with fade effect
                    contactForm.classList.add('hidden');
                    formSuccessMsg.classList.remove('hidden');
                } else {
                    alert(json.message || "Failed to send message. Please try again.");
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                }
            })
            .catch(error => {
                console.error("Submission Error:", error);
                alert("Network error. Please check your internet connection.");
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }

    // --- SCROLL ANIMATION (FADE-IN EFFECTS) ---
    const faders = document.querySelectorAll('.fade-in');
    
    if (faders.length > 0 && 'IntersectionObserver' in window) {
        const appearOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px"
        };

        const appearOnScroll = new IntersectionObserver((entries, appearOnScroll) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('appear');
                appearOnScroll.unobserve(entry.target);
            });
        }, appearOptions);

        faders.forEach(fader => {
            appearOnScroll.observe(fader);
        });
    } else {
        // Fallback for older browsers
        faders.forEach(fader => fader.classList.add('appear'));
    }
});
