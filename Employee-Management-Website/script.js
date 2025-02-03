document.addEventListener('DOMContentLoaded', () => {
    let employees = JSON.parse(localStorage.getItem('employees')) || [];
    
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

    // Modal handling
    const modal = document.getElementById('employeeModal');
    document.getElementById('addEmployee').addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    document.getElementById('cancelBtn').addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Employee form submission
    ddocument.getElementById('employeeForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        const editingId = form.dataset.editingId;
    
        if(editingId) {
            // Update existing employee
            const index = employees.findIndex(emp => emp.id === parseInt(editingId));
            employees[index] = {
                ...employees[index],
                name: form.fullName.value,
                position: form.position.value,
                department: form.department.value,
                hireDate: form.hireDate.value
            };
            delete form.dataset.editingId;
        } else {
            // Add new employee (existing code)
        }
    
        localStorage.setItem('employees', JSON.stringify(employees));
        modal.classList.add('hidden');
        form.reset();
        renderEmployees();
        updateStats();
    });

    document.addEventListener('click', (e) => {
        if(e.target.closest('.delete')) {
            const employeeId = parseInt(e.target.closest('tr').dataset.id);
            employees = employees.filter(emp => emp.id !== employeeId);
            localStorage.setItem('employees', JSON.stringify(employees));
            renderEmployees();
            updateStats();
        }
    });

    document.addEventListener('click', (e) => {
        if(e.target.closest('.edit')) {
            const employeeId = parseInt(e.target.closest('tr').dataset.id);
            const employee = employees.find(emp => emp.id === employeeId);
            openEditModal(employee);
        }
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
    function renderEmployees() {
        const tbody = document.getElementById('employeeTableBody');
        tbody.innerHTML = '';
        
        employees.forEach(emp => {
            const row = document.createElement('tr');
            row.dataset.id = emp.id;
            row.innerHTML = `
                <td>${emp.name}</td>
                <td>${emp.position}</td>
                <td>${emp.department}</td>
                <td>${emp.attendance} days</td>
                <td>${emp.overtime} hours</td>
                <td>
                    <button class="btn-icon edit"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon delete"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Update dashboard stats
    function updateStats() {
        document.getElementById('totalEmployees').textContent = employees.length;
        document.getElementById('presentToday').textContent = 
            employees.filter(emp => emp.attendance > 0).length;
        document.getElementById('totalOvertime').textContent = 
            employees.reduce((sum, emp) => sum + emp.overtime, 0);
    }

    // Initial render
    renderEmployees();
    updateStats();
});