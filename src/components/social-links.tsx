import React from "react"
import Link from "next/link"
import FacebookIcon from "../../public/svgs/facebook-icon"
import XIcon from "../../public/svgs/x-icon"
import InstagramIcon from "../../public/svgs/instagram-icon"

const SocialLinks = () => {
  return (
    <div className="flex items-center gap-4">
      <Link
        href="https://www.facebook.com/share/16ubmGdpB7/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FacebookIcon className="size-7 fill-white text-white transition-transform duration-300 hover:scale-110 active:scale-95" />
      </Link>
      <Link
        href="https://www.instagram.com/useschoolbase?igsh=MXRxczAxcWszcWNsMQ=="
        target="_blank"
        rel="noopener noreferrer"
      >
        <InstagramIcon className="size-7 text-white transition-transform duration-300 hover:scale-110 active:scale-95" />
      </Link>
      <Link href="https://x.com/school_baseng" target="_blank" rel="noopener noreferrer">
        <XIcon className="size-7 fill-white text-white transition-transform duration-300 ease-out hover:scale-110 active:scale-95" />
      </Link>
    </div>
  )
}

export default SocialLinks
