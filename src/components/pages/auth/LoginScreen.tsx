import { useTranslation } from 'next-i18next'
import LogoHorizontal from '@/components/common/atoms/LogoHorizontal'
import { useCallback, useState, useMemo } from 'react'
import useToastMessage from '@/hooks/useToastMessage'
import {
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  signInWithCustomToken,
} from 'firebase/auth'
import { emailSchema, passwordSchema } from '@/utils/form'
import { auth, db, firebaseApp } from '@/lib/firebase'
import clsx from 'clsx'
import Link from '@/components/routing/Link'
import { z } from 'zod'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useWallet } from '@solana/wallet-adapter-react'
import {
  SolanaSignInInput,
  SolanaSignInOutput,
} from '@solana/wallet-standard-features'
import { User, genUserPath } from '@/types/models'
import { useRecoilState } from 'recoil'
import { defaultUser, userState } from '@/store/user'
import { createUserDocumentFromAuth } from '@/components/utils/CreateUserDocumentFromAuth'
import { get } from '@/lib/skeet/firestore'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

const schema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

type Inputs = z.infer<typeof schema>

export default function LoginScreen() {
  const { t } = useTranslation()
  const { connected, signIn } = useWallet()
  const [_user, setUser] = useRecoilState(userState)
  const addToast = useToastMessage()
  const [isLoading, setLoading] = useState(false)

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = useCallback(
    async (data: Inputs) => {
      if (auth) {
        try {
          setLoading(true)
          const userCredential = await signInWithEmailAndPassword(
            auth,
            data.email,
            data.password
          )

          if (!userCredential.user.emailVerified) {
            await sendEmailVerification(userCredential.user)
            await signOut(auth)
            throw new Error('Not verified')
          }
        } catch (err) {
          console.error(err)
          if (err instanceof Error && err.message === 'Not verified') {
            addToast({
              type: 'error',
              title: t('auth:errorNotVerifiedTitle'),
              description: t('auth:errorNotVerifiedBody'),
            })
          } else if (
            err instanceof Error &&
            err.message.includes('auth/user-not-found')
          ) {
            addToast({
              type: 'error',
              title: t('auth:userNotFoundTitle'),
              description: t('auth:userNotFoundBody'),
            })
          } else {
            addToast({
              type: 'error',
              title: t('errorLoginTitle'),
              description: t('errorLoginBody'),
            })
          }
          if (auth?.currentUser) {
            await signOut(auth)
          }
        } finally {
          setLoading(false)
        }
      }
    },
    [t, addToast]
  )

  const signInWithSolana = useCallback(async () => {
    try {
      if (!signIn) {
        throw new Error('signIn is not defined')
      }
      if (signIn && db && auth) {
        const skeetToken = await auth?.currentUser?.getIdToken()
        const signOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${skeetToken}`,
          },
          body: JSON.stringify({}),
        }
        const createResponse = await fetch('/api/sign', signOptions)
        console.log(createResponse)
        const signInResponse = await createResponse?.json()
        const input: SolanaSignInInput = signInResponse?.signInData
        const signInResult = await signIn(input)
        const output: SolanaSignInOutput = {
          ...signInResult,
          account: {
            address: signInResult.account.address,
            publicKey: signInResult.account.publicKey,
            chains: signInResult.account.chains,
            features: signInResult.account.features,
            label: signInResult.account.label,
            icon: signInResult.account.icon,
          },
        }
        const params = {
          input,
          output,
        }
        const verifyOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${skeetToken}`,
          },
          body: JSON.stringify(params),
        }
        const verifyResponse = await fetch('/api/verify', verifyOptions)
        const success = await verifyResponse?.json()
        const userCredential = await signInWithCustomToken(auth, success?.token)
        const { email, username, iconUrl, publicKey, secretKey } =
          await get<User>(db, genUserPath(), userCredential.user.uid)
        const { user } = userCredential
        await createUserDocumentFromAuth(user)
        if (!publicKey || !secretKey) {
          throw new Error('error generating keypairs')
        }
        setUser({
          uid: userCredential.user.uid,
          email,
          username,
          iconUrl,
          publicKey,
          secretKey: secretKey.toString(),
          emailVerified: false,
        })

        return false
      }
    } catch (err) {
      console.error(err)
      if (err instanceof Error) {
        addToast({
          title: err.name,
          description: err.message,
          type: 'error',
        })
      }
      if (auth) {
        setUser(defaultUser)
        await signOut(auth)
      }
    }
  }, [addToast, signIn, setUser])

  const isDisabled = useMemo(
    () => isLoading || errors.email != null || errors.password != null,
    [isLoading, errors.email, errors.password]
  )

  return (
    <>
      <div className="flex h-full flex-col items-center justify-start py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <LogoHorizontal className="mx-auto w-24" />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {t('auth:loginToYourAccount')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            <Link href="/auth/register">
              {t('auth:or')}{' '}
              <span className="font-medium text-indigo-500 hover:text-indigo-400 dark:text-indigo-200 dark:hover:text-indigo-300">
                {t('auth:registerYourAccount')}
              </span>
            </Link>
          </p>
        </div>
        <div className="w-full sm:mx-auto sm:max-w-md">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6 px-4 py-6 sm:px-10">
              <div>
                <p className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-50">
                  {t('auth:email')}
                  {errors.email && (
                    <span className="text-xs text-red-500 dark:text-red-300">
                      {' : '}
                      {t('auth:emailErrorText')}
                    </span>
                  )}
                </p>
                <div className="mt-2">
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="w-full border-2 border-gray-900 p-3 text-lg font-bold text-gray-900 dark:border-gray-50 dark:bg-gray-800 dark:text-white sm:leading-6"
                        inputMode="email"
                      />
                    )}
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-50">
                  {t('auth:password')}
                  {errors.password && (
                    <span className="text-xs text-red-500 dark:text-red-300">
                      {' : '}
                      {t('auth:passwordErrorText')}
                    </span>
                  )}
                </p>
                <div className="mt-2">
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="password"
                        className="w-full border-2 border-gray-900 p-3 text-lg font-bold text-gray-900 dark:border-gray-50 dark:bg-gray-800 dark:text-white sm:leading-6"
                      />
                    )}
                  />
                </div>
              </div>

              <div>
                <p className="px-2 text-right text-sm font-medium text-indigo-500 hover:text-indigo-400 dark:text-indigo-200 dark:hover:text-indigo-300">
                  <Link href="/auth/reset-password">
                    {t('auth:forgotYourPassword')}
                  </Link>
                </p>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isDisabled}
                  className={clsx(
                    isDisabled
                      ? 'cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                      : 'bg-gray-900 text-white hover:bg-gray-700 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200',
                    'w-full px-3 py-2 text-center text-lg font-bold'
                  )}
                >
                  {t('login')}
                </button>
              </div>
            </div>
          </form>
          <div
            className={clsx(
              'flex flex-row items-center justify-center rounded-none bg-gray-900 hover:bg-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700'
            )}
          >
            <WalletMultiButton />
          </div>
          <div
            className={clsx('flex flex-col items-center justify-center gap-2')}
          >
            <button
              onClick={async () => {
                await signInWithSolana()
              }}
              disabled={!connected}
              className={clsx(
                'px-6 py-2',
                !connected
                  ? 'bg-gray-300 text-white hover:cursor-not-allowed dark:bg-gray-800 dark:text-gray-400'
                  : 'bg-green-700 text-white hover:cursor-pointer hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-800'
              )}
            >
              {t('auth:signIn')}
            </button>
            {!connected && (
              <p className="font-light text-gray-500">
                {t('auth:pleaseConnectWallet')}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
