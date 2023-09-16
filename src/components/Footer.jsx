import React from 'react';

function Footer() {
  return (
    <footer className="bg-blue-500 p-4 text-white">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Footer Content */}
          <div>
            <p className="text-sm">&copy; {new Date().getFullYear()} Your Tourism App</p>
            <p className="text-sm">All rights reserved</p>
          </div>

          {/* Contact Information */}
          <div>
            <p className="text-sm">Contact us:</p>
            <p className="text-sm">Email: info@yourtourismapp.com</p>
            <p className="text-sm">Phone: +1 (123) 456-7890</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
