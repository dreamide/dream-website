export default function Footer() {
  return (
    <footer className="text-center text-sm text-muted py-8">
      <img
        src="/dream.png"
        alt="Dream IDE logo"
        className="mx-auto mb-8 w-16"
      />
      Copyright &copy; {new Date().getFullYear()} The Dream IDE Company. All
      rights reserved.
    </footer>
  );
}
