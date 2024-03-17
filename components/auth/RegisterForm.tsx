import { Input } from "../Input";
import { Button } from "../Button";

const LoginForm = () => {
  return (
    <form className="mb-2 flex flex-col mx-6">
      <div className="w-full flex items-center gap-y-4 flex-col">
        <Input
          placeholder="Name"
          id="name"
          className="formInput w-[90%] mx-6"
          type="text"
          required
          autoFocus
        />
        <Input
          placeholder="Email"
          id="email"
          className="formInput w-[90%] mx-6"
          type="email"
          required
        />
        <Input
          placeholder="Password"
          id="password"
          className="formInput w-[90%] mx-6"
          type="password"
          required
        />
      </div>
      <div className="mt-4 mx-4">
        <Button className='w-full' type="submit">Register</Button>
      </div>
    </form>
  )
}

export default LoginForm
