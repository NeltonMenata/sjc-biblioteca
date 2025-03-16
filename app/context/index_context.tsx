import { createContext, useState } from "react";



const IndexContext = createContext({} as any);

export function IndexProvider(props: any){

    const [index, setIndex] = useState(0);
      function updateIndex(n: number) {
        setIndex(n);
      }

    return ( <IndexContext.Provider value={{index, updateIndex}}>
        {
            props.children
        }
    </IndexContext.Provider> )

}

export default IndexContext;