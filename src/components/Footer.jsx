const Footer = () => {
  return (
    <footer className="bg-green-600 text-white text-center fixed bottom-0 left-0 w-full">
      <p className="mb-0 pb-4">
        &copy; {new Date().getFullYear()} Mahfuz&apos;s Apps Store. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
