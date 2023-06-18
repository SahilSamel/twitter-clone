import { useForm, SubmitHandler } from "react-hook-form";
import authpost from "@/api/authpost"

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

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const jsonData = JSON.stringify(data);
    console.log(data);
    authpost(
        '/auth/signIn',
        jsonData,
        function(err: any,data: any){
            if(err){
                console.log(err);
            }else{
                console.log(data);
            }
        }
    )
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