import {createContext, useContext, useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";

import AuthService from '../../Services/AuthService'
import ApiService from "../../Services/ApiService";

type TAuthContext = {
    user?: any,
    login: ({email, password, remember}: { email: string, password: string, remember?: boolean }) => Promise<unknown>
    forceLogout: () => Promise<unknown>
    logout: () => Promise<unknown>
    switchCompany: (companyID: number) => Promise<unknown>
    loading?: boolean
}


const AuthContext = createContext<TAuthContext>(
    {} as TAuthContext
);


export function AuthProvider({children}: any) {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
    const navigate = useNavigate();

    useEffect(() => {
        const userData: string | null = window.localStorage.getItem('_U');

        // This helps prevent staging from crashing in the event the local storage has incorrect data.
        if (userData === null || !userData.includes("email") ||!userData.includes("logo")) {
            new Promise((res) => {
                AuthService.logout().finally(() => {
                    localStorage.removeItem('_U')
                    setUser(undefined)
                    res(0);
                })
            });
            navigate("/");
        } else if (userData && JSON.parse(userData).id) {
            setUser(JSON.parse(userData));
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
                console.log({data})
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
            AuthService.logout().finally(() => {
                localStorage.removeItem('_U')
                setUser(undefined)
                res(0);
            })
        });
    }

    function forceLogout() {
        return new Promise((res) => {
            AuthService.logout().finally(() => {
              localStorage.removeItem('_U');
              setUser(undefined);
              navigate("/login");
              res(0);
            });
          });
    }

    function switchCompany(companyID: number) {
        return new Promise((res) => {
            ApiService.get(`/api/switchCompany/${companyID}`).then(({data}) => {
                if(data.id) {
                    localStorage.setItem('_U', JSON.stringify(data))
                }
                setUser(data)
                res(0)
            })

        });
    }


    const memoedValue = useMemo(
        () => ({
            user,
            loading,
            login,
            forceLogout,
            logout,
            switchCompany
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
