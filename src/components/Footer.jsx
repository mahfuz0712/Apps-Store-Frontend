const Footer = () => {
  return (
    <footer className="bg-green-600 text-white text-center fixed bottom-0 left-0 w-full">
      <p className="mt-4 mb-0 pb-4">
        &copy; {new Date().getFullYear()} | Developed by Mohammad Mahfuz Rahman.
      </p>
    </footer>
  );
};

export default Footer;
