import Image from "next/image"
import logo from '../../../public/logo.svg'
const Logo = () => {
  return (
    <div>
        <Image
          src={logo}
          alt="LMS Logo"
          width={130}
          height={130}
        />
    </div>
  )
}

export default Logo