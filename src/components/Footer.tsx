function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 bg-dark-900">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
            <p className="mb-4">Built with 💙 for the open source community</p>
            <p>&copy; {new Date().getFullYear()} ContributionHub. All rights reserved.</p>
        </div>
    </footer>
  )
}

export default Footer