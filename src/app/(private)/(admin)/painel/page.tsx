import styles from './page.module.css'
import Link from 'next/link'
import {AiOutlineCopy, AiOutlineUser, AiOutlineAudit} from 'react-icons/ai'

export default function Hub(){
    return(
        <main className={styles.container}>
            <section className={styles.sectionContainer}>

                <div className={styles.tableContainer}>
                    <section className={styles.tableHeader}>
                        <h1>PROCESSOS PERTO DO PRAZO</h1>
                    </section>
                    <section className={styles.tableBody}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles.th}>PROCESSO</th>
                                    <th className={styles.th}>MATÉRIA</th>
                                    <th className={styles.th}>CLIENTE</th>
                                    <th className={styles.th}>ADVOGADO</th>
                                    <th className={styles.th}>TIPO</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td className={styles.td}>TN-238347</td>
                                    <td className={styles.td}>Aditivo</td>
                                    <td className={styles.td}>José Bezerra</td>
                                    <td className={styles.td}>Luiz Rosário</td>
                                    <td className={styles.td}>Penal</td>
                                </tr>
                                <tr>
                                    <td className={styles.td}>TN-238347</td>
                                    <td className={styles.td}>Aditivo</td>
                                    <td className={styles.td}>José Bezerra</td>
                                    <td className={styles.td}>Luiz Rosário</td>
                                    <td className={styles.td}>Penal</td>
                                </tr>
                                <tr>
                                    <td className={styles.td}>TN-238347</td>
                                    <td className={styles.td}>Aditivo</td>
                                    <td className={styles.td}>José Bezerra</td>
                                    <td className={styles.td}>Luiz Rosário</td>
                                    <td className={styles.td}>Penal</td>
                                </tr>
                                <tr>
                                    <td className={styles.td}>TN-238347</td>
                                    <td className={styles.td}>Aditivo</td>
                                    <td className={styles.td}>José Bezerra</td>
                                    <td className={styles.td}>Luiz Rosário</td>
                                    <td className={styles.td}>Penal</td>
                                </tr>
                                <tr>
                                    <td className={styles.td}>TN-238347</td>
                                    <td className={styles.td}>Aditivo</td>
                                    <td className={styles.td}>José Bezerra</td>
                                    <td className={styles.td}>Luiz Rosário</td>
                                    <td className={styles.td}>Penal</td>
                                </tr>
                                <tr>
                                    <td className={styles.td}>TN-238347</td>
                                    <td className={styles.td}>Aditivo</td>
                                    <td className={styles.td}>José Bezerra</td>
                                    <td className={styles.td}>Luiz Rosário</td>
                                    <td className={styles.td}>Penal</td>
                                </tr>
                                <tr>
                                    <td className={styles.td}>TN-238347</td>
                                    <td className={styles.td}>Aditivo</td>
                                    <td className={styles.td}>José Bezerra</td>
                                    <td className={styles.td}>Luiz Rosário</td>
                                    <td className={styles.td}>Penal</td>
                                </tr>
                                <tr>
                                    <td className={styles.td}>TN-238347</td>
                                    <td className={styles.td}>Aditivo</td>
                                    <td className={styles.td}>José Bezerra</td>
                                    <td className={styles.td}>Luiz Rosário</td>
                                    <td className={styles.td}>Penal</td>
                                </tr>
                                <tr>
                                    <td className={styles.td}>TN-238347</td>
                                    <td className={styles.td}>Aditivo</td>
                                    <td className={styles.td}>José Bezerra</td>
                                    <td className={styles.td}>Luiz Rosário</td>
                                    <td className={styles.td}>Penal</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                </div>
            </section>
        </main>
    )
}
