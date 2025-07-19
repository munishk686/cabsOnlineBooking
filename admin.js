window.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('bookingForm');
    const responseDiv = document.getElementById('reference');

    if (!form || !responseDiv) {
        console.error('Form or reference div not found');
        return;
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Get the search input value
        const bsearch = document.querySelector('input[name="bsearch"]').value.trim();

        let url = 'admin.php';
        if (bsearch !== '') {
            url += '?bsearch=' + encodeURIComponent(bsearch);
        }

        // Send fetch request
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                // Check if data contains an error message
                if (data.error) {
                    responseDiv.innerHTML = `<div class="error">${data.error}</div>`;
                    return;
                }

                // Clear the previous table content
                responseDiv.innerHTML = '';

                // Create table elements
                const table = document.createElement('table');
                const thead = document.createElement('thead');
                const tbody = document.createElement('tbody');

                // Define table headers
                const headers = ['Booking reference number', 'Customer name', 'Phone', 'Pickup suburb', 'Destination suburb', 'Pickup date and time', 'Status', 'Assign'];

                // Create header row
                const headerRow = document.createElement('tr');
                headers.forEach(headerText => {
                    const th = document.createElement('th');
                    th.textContent = headerText;
                    headerRow.appendChild(th);
                });
                thead.appendChild(headerRow);
                table.appendChild(thead);

                // Populate table rows
                data.forEach(row => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                    <td>${row.reference_number}</td>
                    <td>${row.customer_name}</td>
                    <td>${row.phone_number}</td>
                    <td>${row.suburb}</td>
                    <td>${row.destination_suburb}</td>
                    <td>${row.pick_up_date} ${row.pick_up_time}</td>
                    <td>${row.status}</td>
                    <td><button class="assignBtn" data-ref="${row.reference_number}" ${row.status === 'unassigned' ? '' : 'disabled'}>Assign</button></td>
                `;
                    tbody.appendChild(tr);


                    table.appendChild(tbody);
                    responseDiv.appendChild(table);
                })
                    .catch(error => console.error('Error:', error));
            });
    });
});
