import { useUser } from "@/context/useUser"
import { vi } from "vitest"

const userData = {
    _id: '122',
    age: 12,
    creationDate: '2012-12-02',
    username: 'testname',
    email: 'testmail@op.pl',
    password: 'testpassword',
    __v: 0
}


const mockUser = () => {

    const mockUser = ({data = userData}) => {
        vi.mocked(useUser).mockReturnValue({
            user: data,
            setUser: vi.fn()
        })
    }

  return { mockUser }
}

export default mockUser
