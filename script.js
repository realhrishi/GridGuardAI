// Navigation and UI Functionality
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
    
    // Add active class to clicked nav item
    const activeNavItem = document.querySelector(`a[href="#${sectionId}"]`).closest('.nav-item');
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
    
    // Initialize charts when sections are shown
    if (sectionId === 'dashboard') {
        initializePowerChart();
    } else if (sectionId === 'insights') {
        initializeTrainingChart();
        initializeFeatureChart();
    }
}

// File Upload Functionality
function dropHandler(ev) {
    ev.preventDefault();
    
    const files = ev.dataTransfer.files;
    handleFiles(files);
}

function dragOverHandler(ev) {
    ev.preventDefault();
    ev.currentTarget.style.borderColor = '#3b82f6';
    ev.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
}

function handleFiles(files) {
    const fileList = Array.from(files);
    const validTypes = ['.csv', '.mat'];
    
    fileList.forEach(file => {
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (validTypes.includes(fileExtension)) {
            uploadFile(file);
        } else {
            showNotification('Invalid file type. Please upload CSV or MAT files only.', 'error');
        }
    });
}

function uploadFile(file) {
    // Simulate file upload
    const uploadProgress = document.createElement('div');
    uploadProgress.className = 'upload-progress';
    uploadProgress.innerHTML = `
        <div class="progress-bar">
            <div class="progress-fill"></div>
        </div>
        <span>${file.name} - Uploading...</span>
    `;
    
    document.querySelector('.drop-zone').appendChild(uploadProgress);
    
    // Simulate upload progress
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 30;
        const progressFill = uploadProgress.querySelector('.progress-fill');
        progressFill.style.width = Math.min(progress, 100) + '%';
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            uploadProgress.querySelector('span').textContent = `${file.name} - Upload Complete`;
            setTimeout(() => {
                uploadProgress.remove();
                addFileToTable(file);
                showNotification('File uploaded successfully!', 'success');
            }, 500);
        }
    }, 200);
}

function addFileToTable(file) {
    const tbody = document.querySelector('#upload .table-container tbody');
    const row = document.createElement('tr');
    
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 16).replace('T', ' ');
    
    row.innerHTML = `
        <td>${file.name}</td>
        <td>${file.name.split('.').pop().toUpperCase()}</td>
        <td>${formatFileSize(file.size)}</td>
        <td>${timestamp}</td>
        <td><span class="status-badge completed">Completed</span></td>
        <td>
            <button class="action-btn"><i class="fas fa-eye"></i></button>
            <button class="action-btn"><i class="fas fa-download"></i></button>
        </td>
    `;
    
    tbody.appendChild(row);
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Chart Initialization Functions
function initializePowerChart() {
    const ctx = document.getElementById('powerChart');
    if (!ctx || ctx.chart) return; // Prevent reinitializing
    
    // Generate sample data
    const labels = [];
    const data = [];
    
    for (let i = 0; i < 50; i++) {
        labels.push(i);
        data.push(3 + Math.sin(i * 0.1) * 0.5 + Math.random() * 0.2);
    }
    
    ctx.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Active Power (kW)',
                data: data,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    grid: {
                        color: '#334155'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                x: {
                    grid: {
                        color: '#334155'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });
}

function initializeTrainingChart() {
    const ctx = document.getElementById('trainingChart');
    if (!ctx || ctx.chart) return;
    
    const epochs = Array.from({length: 10}, (_, i) => i + 1);
    const accuracy = [0.65, 0.72, 0.78, 0.84, 0.89, 0.93, 0.95, 0.97, 0.98, 0.982];
    const loss = [0.8, 0.6, 0.45, 0.32, 0.24, 0.18, 0.13, 0.09, 0.06, 0.04];
    
    ctx.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: epochs,
            datasets: [
                {
                    label: 'Accuracy',
                    data: accuracy,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    yAxisID: 'y'
                },
                {
                    label: 'Loss',
                    data: loss,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    grid: {
                        color: '#334155'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false,
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                x: {
                    grid: {
                        color: '#334155'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            }
        }
    });
}

function initializeFeatureChart() {
    const ctx = document.getElementById('featureChart');
    if (!ctx || ctx.chart) return;
    
    const features = ['Voltage RMS', 'Current THD', 'Power Factor', 'Frequency', 'Harmonics'];
    const importance = [0.85, 0.72, 0.68, 0.45, 0.32];
    
    ctx.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: features,
            datasets: [{
                label: 'Importance',
                data: importance,
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(139, 92, 246, 0.8)'
                ],
                borderColor: [
                    '#3b82f6',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444',
                    '#8b5cf6'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1,
                    grid: {
                        color: '#334155'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                x: {
                    grid: {
                        color: '#334155'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Real-time Data Updates
function updateMetrics() {
    const voltage = 230 + (Math.random() - 0.5) * 5;
    const current = 15 + (Math.random() - 0.5) * 2;
    const activePower = 3.5 + (Math.random() - 0.5) * 0.5;
    const reactivePower = 0.8 + (Math.random() - 0.5) * 0.3;
    const pmuMagnitude = 1.02 + (Math.random() - 0.5) * 0.05;
    const pmuPhase = -5.2 + (Math.random() - 0.5) * 2;
    const frequency = 50 + (Math.random() - 0.5) * 0.1;
    
    // Update displayed values
    const valueElements = document.querySelectorAll('.metric-value .value');
    if (valueElements[0]) valueElements[0].textContent = voltage.toFixed(1);
    if (valueElements[1]) valueElements[1].textContent = current.toFixed(1);
    if (valueElements[2]) valueElements[2].textContent = activePower.toFixed(1);
    if (valueElements[3]) valueElements[3].textContent = reactivePower.toFixed(1);
    if (valueElements[4]) valueElements[4].textContent = pmuMagnitude.toFixed(2);
    if (valueElements[5]) valueElements[5].textContent = pmuPhase.toFixed(1);
    if (valueElements[6]) valueElements[6].textContent = frequency.toFixed(2);
}

// Mobile Menu Toggle
function toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}

// Filter Functions for Logs
function filterLogs() {
    const eventFilter = document.querySelector('.logs-filters select:first-child').value;
    const severityFilter = document.querySelector('.logs-filters select:last-child').value;
    const rows = document.querySelectorAll('#logs tbody tr');
    
    rows.forEach(row => {
        const eventType = row.querySelector('.event-type').textContent.trim();
        const severity = row.querySelector('.severity').textContent.trim();
        
        let showRow = true;
        
        if (eventFilter !== 'All Events' && eventType !== eventFilter) {
            showRow = false;
        }
        
        if (severityFilter !== 'All Severities' && severity !== severityFilter) {
            showRow = false;
        }
        
        row.style.display = showRow ? 'table-row' : 'none';
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initialize default section
    showSection('dashboard');
    
    // File input change handler
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            handleFiles(e.target.files);
        });
    }
    
    // Filter event listeners
    const filterSelects = document.querySelectorAll('.logs-filters select');
    filterSelects.forEach(select => {
        select.addEventListener('change', filterLogs);
    });
    
    // Start real-time updates
    setInterval(updateMetrics, 3000);
    
    // Add mobile menu button if needed
    if (window.innerWidth <= 768) {
        addMobileMenuButton();
    }
});

// Mobile menu button
function addMobileMenuButton() {
    const header = document.querySelector('.header');
    const menuButton = document.createElement('button');
    menuButton.innerHTML = '<i class="fas fa-bars"></i>';
    menuButton.className = 'mobile-menu-button';
    menuButton.onclick = toggleMobileMenu;
    header.insertBefore(menuButton, header.firstChild);
}

// Responsive handler
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.remove('open');
    }
});

// Export functions
window.showSection = showSection;
window.dropHandler = dropHandler;
window.dragOverHandler = dragOverHandler;