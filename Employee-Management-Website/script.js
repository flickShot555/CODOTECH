let employees = [];

document.addEventListener('DOMContentLoaded', () => {
    const storedCSV = localStorage.getItem('employeeCSV');
    if (storedCSV) {
        employees = csvToEmployees(storedCSV);
    } else {
        employees = []; // or initialize with default data if needed
    }

    renderEmployees();
    updateStats();

    function updatePersistentData() {
        const csvData = employeesToCSV(employees);
        localStorage.setItem('employeeCSV', csvData);
    }

    //let employees = JSON.parse(localStorage.getItem('employees')) || [];
    
    // Converts an array of employee objects to a CSV string.
    function employeesToCSV(employees) {
        if (!employees.length) return '';
        const headers = ["id", "name", "position", "department", "hireDate", "attendance", "overtime"];
        const csvRows = [
            headers.join(',')
        ];
        employees.forEach(emp => {
            // Create a row array by mapping headers to corresponding employee values.
            const row = headers.map(header => emp[header] || '');
            csvRows.push(row.join(','));
        });
        return csvRows.join('\n');
    }

    // Parses a CSV string to produce an array of employee objects.
    function csvToEmployees(csvData) {
        const lines = csvData.split('\n').filter(line => line.trim() !== '');
        if (!lines.length) return [];
        const headers = lines[0].split(',');
        const employees = lines.slice(1).map(line => {
            const values = line.split(',');
            let employee = {};
            headers.forEach((header, index) => {
                employee[header.trim()] = values[index]?.trim();
            });
            return employee;
        });
        return employees;
    }


    // Chart initialization
    const ctx = document.getElementById('attendanceChart').getContext('2d');
    const attendanceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            datasets: [{
                label: 'Weekly Attendance',
                data: [12, 19, 3, 5, 2, 3],
                borderColor: '#2A5C82',
                tension: 0.4
            }]
        }
    });

    // Implement Search Functionality
    document.querySelector('.search-bar input').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = employees.filter(emp => 
            emp.name.toLowerCase().includes(searchTerm) ||
            emp.position.toLowerCase().includes(searchTerm) ||
            emp.department.toLowerCase().includes(searchTerm)
        );
        renderEmployees(filtered);
    });

    // Modal handling
    const modal = document.getElementById('employeeModal');
    document.getElementById('addEmployee').addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    document.getElementById('cancelBtn').addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Add navigation handling in script.js
    document.querySelectorAll('.nav-items li').forEach(item => {
        item.addEventListener('click', (e) => {
            // Remove active class from all items
            document.querySelectorAll('.nav-items li').forEach(li => 
                li.classList.remove('active'));
            
            // Add active class to clicked item
            e.currentTarget.classList.add('active');
            
            // Hide all sections
            document.querySelectorAll('section').forEach(section => 
                section.classList.add('hidden'));
            
            // Show target section
            const targetId = e.currentTarget.querySelector('a').getAttribute('href');
            document.querySelector(targetId).classList.remove('hidden');
        });
    });

    // Add UUID generator
    function generateID() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Employee form submission
    document.getElementById('employeeForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        if(!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        const formData = new FormData(form);
    
        if(form.dataset.editingId) {
            // Update existing employee
            const employeeId = parseInt(form.dataset.editingId);
            const employee = employees.find(emp => emp.id === employeeId);
            employee.name = formData.get('fullName');
            employee.position = formData.get('position');
            employee.department = formData.get('department');
            employee.hireDate = formData.get('hireDate');
            //employee.salary = formData.get('salary');
            //employee.lastAttendance = new Date().toLocaleDateString();
            delete form.dataset.editingId;
        } else {
            let newEmployee = {
                id: generateID(),
                name: formData.get('fullName'),
                position: formData.get('position'),
                department: formData.get('department'),
                hireDate: formData.get('hireDate'),
                attendance: 0,
                overtime: 0
            };
            employees.push(newEmployee);
        }
    
        localStorage.setItem('employees', JSON.stringify(employees));
        modal.classList.add('hidden');
        form.reset();
        renderEmployees();
        updateStats();
        updateChart();
        updatePersistentData();
    });

    document.getElementById('exportCsv').addEventListener('click', () => {
        // Update localStorage with the latest employee data.
        updatePersistentData();
    
        // Optionally, trigger a download of the CSV file.
        const csvData = employeesToCSV(employees);
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'employees.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    document.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete');
        if (deleteBtn) {
            const row = deleteBtn.closest('tr');
            const employeeId = row.dataset.id; // using the ID as a string
            employees = employees.filter(emp => emp.id !== employeeId);
            renderEmployees();
            updateStats();
            updatePersistentData(); // Save updated data to localStorage
        }
    });

    document.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.edit');
            if (editBtn) {
                const row = editBtn.closest('tr');
                const employeeId = row.dataset.id; // Using the ID as a string directly
                const employee = employees.find(emp => emp.id === employeeId);
                if (employee) {
                    openEditModal(employee);
                }
            }
            updatePersistentData();
    });

    function openEditModal(employee) {
        const form = document.getElementById('employeeForm');
        form.fullName.value = employee.name;
        form.position.value = employee.position;
        form.department.value = employee.department;
        form.hireDate.value = employee.hireDate;
        form.dataset.editingId = employee.id;
        
        modal.classList.remove('hidden');
    }

    // Render employee list
    function renderEmployees(filteredEmployees = employees) {
        const tbody = document.getElementById('employeeTableBody');
        tbody.innerHTML = '';
        
        filteredEmployees.forEach(emp => {
            const row = document.createElement('tr');
            row.dataset.id = emp.id;
            row.innerHTML = `
                <td>${emp.name}</td>
                <td>${emp.position}</td>
                <td>${emp.department}</td>
                <td>
                    <div class="attendance-controls">
                        <button class="btn-icon add-attendance" data-id="${emp.id}">
                            <i class="fas fa-calendar-plus"></i>
                        </button>
                        <span>${emp.attendance}</span>
                        <button class="btn-icon remove-attendance" data-id="${emp.id}">
                            <i class="fas fa-calendar-minus"></i>
                        </button>
                    </div>
                </td>
                <td>
                    <div class="overtime-controls">
                        <button class="btn-icon add-overtime" data-id="${emp.id}">
                            <i class="fas fa-plus-circle"></i>
                        </button>
                        <span>${emp.overtime}</span>
                        <button class="btn-icon remove-overtime" data-id="${emp.id}">
                            <i class="fas fa-minus-circle"></i>
                        </button>
                    </div>
                </td>
                <td>
                    <button class="btn-icon edit"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon delete"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Add event listeners for attendance/overtime
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const employeeId = btn.dataset.id;
        if (!employeeId) return;
        
        if (btn.classList.contains('add-attendance')) {
            updateAttendance(employeeId, 1);
        } else if (btn.classList.contains('remove-attendance')) {
            updateAttendance(employeeId, -1);
        } else if (btn.classList.contains('add-overtime')) {
            updateOvertime(employeeId, 1);
        } else if (btn.classList.contains('remove-overtime')) {
            updateOvertime(employeeId, -1);
        } 
    });

    function updateAttendance(id, value) {
        const employee = employees.find(emp => emp.id === id);
        employee.attendance = Math.max(0, employee.attendance + value);
        employee.lastAttendance = new Date().toLocaleDateString(); // For chart
        localStorage.setItem('employees', JSON.stringify(employees));
        updateAll();
    }
    
    function updateOvertime(id, value) {
        const employee = employees.find(emp => emp.id === id);
        employee.overtime = Math.max(0, employee.overtime + value);
        localStorage.setItem('employees', JSON.stringify(employees));
        updateAll();
    }
    
    function updateAll() {
        updateStats();
        renderEmployees();
        updateChart();
        updatePersistentData();
    }

    // Update dashboard stats
    // Prevent negative values in stats
    function updateStats() {
        const presentToday = employees.filter(emp => emp.attendance > 0).length;
        const totalOvertime = employees.reduce((sum, emp) => sum + Math.max(0, emp.overtime), 0);
        
        document.getElementById('totalEmployees').textContent = employees.length;
        document.getElementById('presentToday').textContent = presentToday;
        document.getElementById('totalOvertime').textContent = totalOvertime;
        
        // Update report section
        document.getElementById('reportTotalEmployees').textContent = employees.length;
        document.getElementById('reportAvgAttendance').textContent = 
            (presentToday / employees.length || 0).toFixed(1);
        document.getElementById('reportTotalOvertime').textContent = totalOvertime;
    }

    // Initialize chart with empty data first
    function initChart() {
        const ctx = document.getElementById('attendanceChart').getContext('2d');
        window.attendanceChart = new Chart(ctx, {
            type: 'line',
            data: getChartData(),
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' }
                }
            }
        });
    }
    initChart();

    function getChartData() {
        const last7Days = Array.from({length: 7}, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toLocaleDateString();
        }).reverse();
    
        return {
            labels: last7Days,
            datasets: [{
                label: 'Daily Attendance',
                data: last7Days.map(date => 
                    employees.filter(emp => emp.lastAttendance === date).length
                ),
                borderColor: '#2A5C82',
                tension: 0.4
            }]
        };
    }

    function updateChart() {
        attendanceChart.data = getChartData();
        attendanceChart.update();
    }

    // Initial render
    renderEmployees();
    updateStats();
});