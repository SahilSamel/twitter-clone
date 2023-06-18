import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";

type Inputs = {
  email: string;
  password: string;
};

const Login = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await axios.post("http://localhost:6969/signin", data);
      console.log(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form className="flex justify-center flex-col" onSubmit={handleSubmit(onSubmit)}>
      <input className="my-5" {...register("email", { required: true })} />
      {errors.email && <span>This field is required</span>}

      <input className="my-5" {...register("password", { required: true })} />
      {errors.password && <span>This field is required</span>}

      <input className="text-white" type="submit" />
    </form>
  );
}

export default Login