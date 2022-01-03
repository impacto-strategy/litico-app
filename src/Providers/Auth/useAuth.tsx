import {createContext, useContext, useEffect, useMemo, useState} from "react";
import AuthService from '../../Services/AuthService'

type TAuthContext = {
    user?: any,
    login: ({email, password, remember}: { email: string, password: string, remember?: boolean }) => Promise<unknown>
    logout: () => Promise<unknown>
    loading?: boolean
}


const AuthContext = createContext<TAuthContext>(
    {} as TAuthContext
);


export function AuthProvider({children}: any) {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingInitial, setLoadingInitial] = useState<boolean>(true);


    useEffect(() => {
        const userData = window.localStorage.getItem('_U')
        if (userData && JSON.parse(userData).id) {
            setUser(JSON.parse(userData))
        }
        setLoadingInitial(false)
    }, [])


    function login({email, password, remember}: { email: string, password: string, remember?: boolean }) {
        setLoading(true);
        return new Promise((res, rej) => {
            AuthService.login({
                email, password, remember
            }).then(({data}) => {
                if (data.id) {
                    localStorage.setItem('_U', JSON.stringify(data))
                }
                setUser(data)
                res(0)
            }).catch(e => rej(e.response))
                .finally(() => {
                    setLoading(false)
                })
        });
    }

    function logout() {
        return new Promise((res) => {
            AuthService.logout().then((res2) => {
                if (res2.status === 204) {
                    localStorage.removeItem('_U')
                    setUser(undefined)
                }
                res(0);
            })
        });
    }


    const memoedValue = useMemo(
        () => ({
            user,
            loading,
            login,
            logout,
        }),
        [user, loading]
    );

    return (
        <AuthContext.Provider value={memoedValue}>
            {!loadingInitial && children}
        </AuthContext.Provider>
    );
}

export default function useAuth() {
    return useContext(AuthContext);
}
