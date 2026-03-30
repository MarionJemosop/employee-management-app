document.addEventListener('DOMContentLoaded', initializeApp);

function initializeApp() {
    const currentPage = window.location.pathname;
    
    initializeLocalStorage();
    
    if (currentPage.includes('new-contact.html')) {
        initializeNewContactPage();
    } else if (currentPage.includes('view-contacts.html')) {
        initializeViewContactsPage();
    } else if (currentPage.includes('index.html') || currentPage === '/' || currentPage.endsWith('/')) {
        initializeHomePage();
    }
}

function initializeLocalStorage() {
    if (!localStorage.getItem('employees')) {
        const sampleEmployees = [
            {
                id: 1,
                fullName: 'Ann Mutiga',
                email: 'ann@company.com',
                phone: '+254712345678',
                department: 'HR',
                position: 'HR Manager'
            },
            {
                id: 2,
                fullName: 'Carren Nyaboke',
                email: 'carren@company.com',
                phone: '+254712345679',
                department: 'IT',
                position: 'Software Developer'
            },
            {
                id: 3,
                fullName: 'Cecilia Nyokabi Njoroge',
                email: 'cecilia@company.com',
                phone: '+254712345680',
                department: 'Finance',
                position: 'Finance Manager'
            },
            {
                id: 4,
                fullName: 'Charles Onyango',
                email: 'charles@company.com',
                phone: '+254712345681',
                department: 'Marketing',
                position: 'Marketing Director'
            },
            {
                id: 5,
                fullName: 'Christine Mogeni',
                email: 'christine@company.com',
                phone: '+254712345682',
                department: 'Operations',
                position: 'Operations Lead'
            }
        ];
        localStorage.setItem('employees', JSON.stringify(sampleEmployees));
    }
}

function initializeHomePage() {
    updateDashboard();
}

function updateDashboard() {
    const employees = getEmployees();
    const departments = new Set(employees.map(e => e.department));
    
    // Update contact count
    const contactCountElement = document.querySelector('.card.green h2');
    if (contactCountElement) {
        contactCountElement.textContent = employees.length;
    }
    
    // Update position count (number of unique departments)
    const positionCountElement = document.querySelector('.card.blue h2');
    if (positionCountElement) {
        positionCountElement.textContent = departments.size;
    }
}

function initializeNewContactPage() {
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newEmployee = {
        id: Date.now(),
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        department: formData.get('department'),
        position: formData.get('position')
    };

    if (!validateEmployee(newEmployee)) {
        alert('Please fill in all fields correctly');
        return;
    }

    const employees = getEmployees();
    employees.push(newEmployee);
    saveEmployees(employees);

    alert('Employee added successfully!');

    e.target.reset();

    setTimeout(() => {
        window.location.href = 'view-contacts.html';
    }, 1500);
}

function validateEmployee(employee) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
    
    return (
        employee.fullName.trim().length > 0 &&
        emailRegex.test(employee.email) &&
        phoneRegex.test(employee.phone) &&
        employee.department.length > 0 &&
        employee.position.trim().length > 0
    );
}

function initializeViewContactsPage() {
    renderContactsTable();

    setupModalHandlers();
}

function renderContactsTable() {
    const employees = getEmployees();
    const tbody = document.querySelector('.contacts-table tbody');
    
    if (!tbody) return;

    tbody.innerHTML = '';

    employees.forEach((employee, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${employee.fullName}</td>
            <td>${employee.phone}</td>
            <td>${employee.email}</td>
            <td>${employee.department}</td>
            <td class="actions">
                <button class="btn btn-info" onclick="viewDetails(${employee.id})">Details</button>
                <button class="btn btn-warning" onclick="editContact(${employee.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteContact(${employee.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    updateDashboard();
}

function viewDetails(employeeId) {
    const employee = getEmployeeById(employeeId);
    if (!employee) return;
    
    const message = `
Employee Details:

Name: ${employee.fullName}
Email: ${employee.email}
Phone: ${employee.phone}
Department: ${employee.department}
Position: ${employee.position}
    `;
    
    alert(message);
}

function editContact(employeeId) {
    const employee = getEmployeeById(employeeId);
    if (!employee) return;
    
    const fullName = prompt('Full Name:', employee.fullName);
    if (fullName === null) return;
    
    const email = prompt('Email:', employee.email);
    if (email === null) return;
    
    const phone = prompt('Phone:', employee.phone);
    if (phone === null) return;
    
    const department = prompt('Department (HR/IT/Finance/Marketing/Operations):', employee.department);
    if (department === null) return;
    
    const position = prompt('Position:', employee.position);
    if (position === null) return;

    const updatedEmployee = {
        id: employee.id,
        fullName,
        email,
        phone,
        department,
        position
    };
    
    if (!validateEmployee(updatedEmployee)) {
        alert('Invalid data. Please check your input.');
        return;
    }

    const employees = getEmployees();
    const index = employees.findIndex(e => e.id === employeeId);
    if (index !== -1) {
        employees[index] = updatedEmployee;
        saveEmployees(employees);
        alert('Employee updated successfully!');
        renderContactsTable();
    }
}

function deleteContact(employeeId) {
    const employee = getEmployeeById(employeeId);
    if (!employee) return;
    
    if (confirm(`Are you sure you want to delete ${employee.fullName}?`)) {
        const employees = getEmployees();
        const filteredEmployees = employees.filter(e => e.id !== employeeId);
        saveEmployees(filteredEmployees);
        alert('Employee deleted successfully!');
        renderContactsTable();
    }
}

function getEmployees() {
    const data = localStorage.getItem('employees');
    return data ? JSON.parse(data) : [];
}

function saveEmployees(employees) {
    localStorage.setItem('employees', JSON.stringify(employees));
}

function getEmployeeById(id) {
    const employees = getEmployees();
    return employees.find(e => e.id === id);
}

function setupModalHandlers() {
}

function formatPhoneNumber(phone) {
    if (phone.length > 10) {
        return phone.substring(0, 7) + '...';
    }
    return phone;
}
