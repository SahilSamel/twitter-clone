import { useForm, SubmitHandler } from "react-hook-form";
import authpost from "@/api/authpost"

type Inputs = {
  email: string;
  password: string;
  userHandle: string;
};

export default function SignUp() {
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
        '/auth/signup',
        jsonData,
        function(err: any,data: any){
            if(err){
                console.log(err);
            }else{
                console.log(jsonData);
            }
        }
    )
  };

  return (
    <form className="flex justify-center flex-col" onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="Enter Email" className="my-5" {...register("email", { required: true })} />
      {errors.email && <span>This field is required</span>}

      <input placeholder="Enter Password" className="my-5" {...register("password", { required: true })} />
      {errors.password && <span>This field is required</span>}

      <input placeholder="Enter User Handle" className="my-5" {...register("userHandle", { required: true })} />
      {errors.userHandle && <span>This field is required</span>}

      <input className="text-white" type="submit" />
    </form>
  );
}
