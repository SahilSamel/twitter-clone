import { useDispatch } from 'react-redux';
import { setToken, setUserHandle,setUserId } from '@/state/authStates';
import { setLastServedTimestamp } from '@/state/cacheStates';
import { useRouter } from 'next/router';
import { useForm, SubmitHandler } from 'react-hook-form';
import POST from '@/api/POST/POST';
type Inputs = {
  email: string;
  password: string;
};

type LoginProps = {
  toggleForm: () => void;
};

const Login = ({ toggleForm }: LoginProps) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const jsonData = JSON.stringify(data);
    POST('/auth/signIn', jsonData, function (err: any, data: any) {
      if (err) {
        console.log(err);
      } else {
        const { token,uid,userHandle } = data;
        dispatch(setToken(token));
        dispatch(setUserId(uid));
        dispatch(setUserHandle(userHandle));
        dispatch(setLastServedTimestamp(Date.now()));
        router.push('/');
      }
    });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-zinc-900	">
      <div className="rounded-lg shadow-lg p-6 bg-black">
        <h1 className="text-3xl font-bold mb-6 text-slate-200	text-center">Log in to Twitter</h1>
        <form className="w-full max-w-sm mx-auto" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-slate-200	 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-slate-200	 leading-tight bg-black focus:outline-none focus:shadow-outline"
              type="text"
              placeholder="Email"
              {...register('email', { required: true })}
            />
            {errors.email && <span className="text-red-500 text-xs">This field is required</span>}
          </div>
          <div className="mb-4">
            <label className="block text-slate-200	 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-slate-200	 leading-tight focus:outline-none focus:shadow-outline bg-black"
              type="password"
              placeholder="Password"
              {...register('password', { required: true })}
            />
            {errors.password && <span className="text-red-500 text-xs">This field is required</span>}
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Log in
            </button>
          </div>
          <div className="flex items-center justify-center mt-4">
            <button
              className="text-blue-500 hover:text-blue-700 text-sm font-semibold focus:outline-none"
              type="button"
              onClick={toggleForm}
            >
              Don't have an account? Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
