import Image from 'next/image'
import Link from 'next/link';
import React from 'react'

function Footer() {
  const icons = [
      { link: "https://www.linkedin.com/in/abdellah-edaoudi-0bbba02a5/", src: '/Icons/link.svg', alt: 'Linkedin' },
      { link: "https://www.instagram.com/edaoudi_abdellah", src: '/Icons/ins.svg', alt: 'Instagram' },
      { link: "https://www.youtube.com/@edaoudidev", src: '/Icons/yt.svg', alt: 'YouTube' },
      { link: "https://github.com/AbdellahEdaoudi", src: '/Icons/github.svg', alt: 'GitHub' },
    { link: "", src: '/Icons/fb.svg', alt: 'Facebook' },
    { link: "", src: '/Icons/messenger.svg', alt: 'Messenger' },
    { link: "", src: '/Icons/reddit.svg', alt: 'Reddit' },
    { link: "", src: '/Icons/snap.svg', alt: 'Snapchat' },
    { link: "", src: '/Icons/tele.svg', alt: 'Telegram' },
    { link: "", src: '/Icons/tik.svg', alt: 'TikTok' },
    { link: "", src: '/Icons/twit.svg', alt: 'Twitter' },
    { link: "", src: '/Icons/twitch.svg', alt: 'Twitch' },
    { link: "", src: '/Icons/wts.svg', alt: 'WhatsApp' },
  ];

  return (
    <footer className="bg-white pt-2 pb-8 ">
      <div className="flex md:flex-row md:justify-around flex-col items-center">
        <div>
        <Image src="/Logo/ed_Qrcode_img.png" width={200} height={100} alt="Logo" />
        </div>
        <div className="flex flex-wrap justify-center  gap-4">
          {icons.map((icon, i) => (
            <Link className={`${!icon.link && "hidden"}`} key={i} href={icon.link} target="_blank">
              <Image src={icon.src} alt={icon.alt} width={30} height={30} className="transition-transform transform hover:scale-110" />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer;
