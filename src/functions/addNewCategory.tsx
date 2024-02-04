import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';


export async function addNewCategory(newCategory: string) {
    const token = Cookies.get('accessToken');

    try {
        const response = await axios.post('http://localhost:3333/category', {
            name: newCategory,
        }, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })

        /* setCategories([...categories, response.data.name]); */

        const { data } = await axios.get('http://localhost:3333/users', {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })

        for (const user of data) {
            if(user.role !== 'lawyer') continue
            try {
                await axios.post(
                    'http://localhost:3333/specialty',
                    {
                        affinity: 0,
                        categoryId: Number(response.data.id),
                        userId: Number(user.id),
                    },
                    {
                        withCredentials: true,
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
            } catch (error) {
                console.log(error)
                toast.error(`Erro na adição de especialidade para o usuário ${user}: ${(error as any).message}`)
            }
        }

        toast.success('Categoria criada com sucesso!');
    } catch (error) {
        console.log(error)
        console.log(`Tipo de erro: ${(error as any).message}`)
        toast.error(`Erro na criação da categoria: ${(error as any).response.data.message}`)
    }
}