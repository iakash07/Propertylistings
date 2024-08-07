document.addEventListener('DOMContentLoaded', () => {
    const propertyContainer = document.getElementById('property-container');
    const cart = document.getElementById('cart');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutContainer = document.getElementById('checkout-container');
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    const checkoutForm = document.getElementById('checkout-form');

    let cartData = JSON.parse(localStorage.getItem('cartData')) || [];

    const properties = [
        { id: 1, title: 'Oceanfront Villa', description: 'Experience luxury and tranquility in this stunning oceanfront villa...', price: 1200, image: 'Image/OceanVilla.jpg', location: 'beach', bedrooms: 3, amenities: ['pool', 'wifi'] },
        { id: 2, title: 'City Apartment', description: 'Modern apartment in the heart of the city with easy access to attractions...', price: 800, image: 'Image/Cottage.jpg', location: 'city', bedrooms: 2, amenities: ['wifi'] },
        { id: 3, title: 'Countryside House', description: 'Charming house in the countryside with spacious grounds and private pool...', price: 600, image: 'Image/urban loft.jpg', location: 'countryside', bedrooms: 4, amenities: ['pool', 'parking'] },
        { id: 4, title: 'Mountain Cabin', description: 'Cozy cabin nestled in the mountains with breathtaking views and modern amenities...', price: 1000, image: 'Image/Mountain Lodge.jpg', location: 'mountain', bedrooms: 5, amenities: ['wifi', 'parking'] },
        { id: 5, title: 'Historic Mansion', description: 'Step back in time with this grand historic mansion. Featuring classic architecture, antique furnishings, and beautifully landscaped gardens, it provides a luxurious and nostalgic stay', price: 1300, image: 'Image/Historic mansion.jpg', location: 'Historic Mansion', bedrooms: 4, amenities: ['wifi', 'parking'] }
    ];

    const updateCart = () => {
        localStorage.setItem('cartData', JSON.stringify(cartData));
        cartItems.innerHTML = '';
        let total = 0;
        cartData.forEach(item => {
            const property = document.createElement('div');
            property.classList.add('checkout-item');
            property.innerHTML = `
                <p>${item.title} - $${item.price} per night</p>
                <p>Dates: ${item.dates}</p>
                <p>Quantity: ${item.quantity}</p>
                <button class="remove-button" data-id="${item.id}">Remove</button>
                <button class="increase" data-id="${item.id}">Increase</button>
                <button class="decrease" data-id="${item.id}">Decrease</button>
            `;
            cartItems.appendChild(property);
            total += item.price * item.quantity;
        });
        cartTotal.textContent = total.toFixed(2);
    };

    const filterProperties = () => {
        const location = document.getElementById('location-filter').value;
        const price = parseInt(document.getElementById('price-filter').value);
        const bedrooms = document.getElementById('bedrooms-filter').value;
        const amenities = Array.from(document.querySelectorAll('#amenities-filter input:checked')).map(input => input.value);

        propertyContainer.innerHTML = '';

        properties.filter(property => {
            return (!location || property.location === location) &&
                   property.price <= price &&
                   (!bedrooms || (bedrooms === '4+' ? property.bedrooms >= 4 : property.bedrooms == bedrooms)) &&
                   amenities.every(amenity => property.amenities.includes(amenity));
        }).forEach(property => {
            const card = document.createElement('div');
            card.classList.add('property-card');
            card.setAttribute('data-location', property.location);
            card.setAttribute('data-price', property.price);
            card.setAttribute('data-bedrooms', property.bedrooms);
            card.setAttribute('data-amenities', property.amenities.join(','));

            card.innerHTML = `
                <img src="${property.image}" alt="${property.title}">
                <h2>${property.title}</h2>
                <p>${property.description}</p>
                <p class="price">$${property.price} per night</p>
                <button class="book-now-button" data-id="${property.id}" data-title="${property.title}" data-price="${property.price}">Book Now</button>
            `;
            propertyContainer.appendChild(card);
        });
    };

    const showCheckout = () => {
        cart.style.display = 'none';
        checkoutContainer.style.display = 'block';
        checkoutItems.innerHTML = '';
        let total = 0;
        cartData.forEach(item => {
            const property = document.createElement('div');
            property.classList.add('checkout-item');
            property.innerHTML = `
                <p>${item.title} - $${item.price} per night</p>
                <p>Dates: ${item.dates}</p>
                <p>Quantity: ${item.quantity}</p>
            `;
            checkoutItems.appendChild(property);
            total += item.price * item.quantity;
        });
        checkoutTotal.textContent = total.toFixed(2);
    };

    document.getElementById('location-filter').addEventListener('change', filterProperties);
    document.getElementById('price-filter').addEventListener('input', () => {
        document.getElementById('price-value').textContent = document.getElementById('price-filter').value;
        filterProperties();
    });
    document.getElementById('bedrooms-filter').addEventListener('change', filterProperties);
    Array.from(document.querySelectorAll('#amenities-filter input')).forEach(input => input.addEventListener('change', filterProperties));

    propertyContainer.addEventListener('click', e => {
        if (e.target.classList.contains('book-now-button')) {
            const id = e.target.getAttribute('data-id');
            const title = e.target.getAttribute('data-title');
            const price = parseFloat(e.target.getAttribute('data-price'));
            const existingItem = cartData.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cartData.push({
                    id,
                    title,
                    price,
                    quantity: 1,
                    dates: prompt('Enter booking dates (e.g., 2024-08-01 to 2024-08-07)')
                });
            }
            updateCart();
        }
    });

    cart.addEventListener('click', e => {
        if (e.target.classList.contains('remove-button')) {
            const id = e.target.getAttribute('data-id');
            cartData = cartData.filter(item => item.id !== id);
            updateCart();
        } else if (e.target.classList.contains('increase')) {
            const id = e.target.getAttribute('data-id');
            const item = cartData.find(item => item.id === id);
            if (item) {
                item.quantity++;
                updateCart();
            }
        } else if (e.target.classList.contains('decrease')) {
            const id = e.target.getAttribute('data-id');
            const item = cartData.find(item => item.id === id);
            if (item) {
                item.quantity--;
                if (item.quantity <= 0) {
                    cartData = cartData.filter(cartItem => cartItem.id !== id);
                }
                updateCart();
            }
        }
    });

    document.getElementById('checkout-button').addEventListener('click', showCheckout);

    checkoutForm.addEventListener('submit', e => {
        e.preventDefault();
        alert('Booking Complete!');
        localStorage.removeItem('cartData');
        cartData = [];
        cart.style.display = 'block';
        checkoutContainer.style.display = 'none';
        updateCart();
        filterProperties();
    });

    filterProperties(); // Initialize with default properties
});
