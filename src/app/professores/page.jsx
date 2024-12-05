"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import AlertSucesso from "../components/AlertSucesso";

export default function ListarProdutos() {
  const router = useRouter();
  const [data, setData] = useState([{}]);
  const [isLoading, setIsLoading] = useState(true);

  // estados para alertas
  const [mostrarAlertaSucesso, setMostrarAlertaSucesso] = useState(false);

  const fetchData = async () => {
    try {
      const resposta = await axiosInstance.get("/professor/listar");
      setData(resposta.data);
    } catch (error) {
      if (error.response) {
        // A resposta do servidor foi recebida, mas contém erro (status code diferente de 2xx)
        console.error("Erro de resposta:", error.response.status);
      } else if (error.request) {
        // A requisição foi feita, mas nenhuma resposta foi recebida
        console.error("Erro de requisição:", error.request);
      } else {
        // Outro tipo de erro ocorreu
        console.error("Erro ao configurar requisição:", error.message);
      }
    }
  };

  // const atualizarProdBtnEditar = (id) => {
  //   if (id) {
  //     data.map((prod) => {
  //       if (prod.id == id) {
  //         setIdProd(prod.id);
  //         setNomeProd(prod.nome);
  //         setProdQuantidade(prod.quantidade);
  //         setProdPreco(prod.preco);
  //       } else {
  //         return console.log("erro ao buscar por id");
  //       }
  //     });
  //   }
  // };

  useEffect(() => {
    fetchData();
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  const removerProfessor = async (id) => {
    try {
      const resposta = await axiosInstance.delete(`/professor/${id}`);
      alert("Professor deletado com sucesso");
      fetchData();
      setTimeout(() => setIsLoading(false), 500);
    } catch (error) {
      if (error.response) {
        // A resposta do servidor foi recebida, mas contém erro (status code diferente de 2xx)
        console.error("Erro de resposta:", error.response.status);
        alert("Erro de resposta:");
      } else if (error.request) {
        // A requisição foi feita, mas nenhuma resposta foi recebida
        console.error("Erro de requisição:", error.request);
        alert("Erro de requisição");
      } else {
        // Outro tipo de erro ocorreu
        console.error("Erro ao configurar requisição:", error.message);
        alert("Erro ao configurar requisição");
      }
    }
  };

  const formatarNumeroTelefone = (numero) => {
    return numero.replace(/(\d{2})(\d{4,5})(\d{4})/, "($1) $2-$3");
  };

  if (isLoading) {
    return (
      <div className="flex w-full md:w-[80%] m-auto items-center justify-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 w-full justify-center items-center m-auto">
          <span className="loading loading-dots loading-lg"></span>
        </main>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-screen-xl m-auto items-center justify-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 w-full justify-center items-center m-auto">
        <div className=" flex justify-around w-full">
          <h1 className="text-4xl font-bold">Lista de Professores</h1>
          <button
            onClick={() => {
              router.push("/professores/cadastrar");
            }}
            className="btn btn-active btn-primary"
          >
            Cadastrar Professor
          </button>
        </div>
        <div className="overflow-x-auto w-full shadow-lg shadow-indigo-500/50 p-2 rounded-lg">
          <table className="table table-zebra text-center">
            {/* head */}
            <thead>
              <tr className="text-black font-bold text-base">
                <th>ID</th>
                <th>Nome</th>
                <th>Area Atuação</th>
                <th>Telefone</th>
              </tr>
            </thead>
            <tbody>
              {/* row  */}
              {data.map((professor, index) => (
                <tr key={index}>
                  <th>{professor.idprofessor}</th>
                  <td>{professor.nome}</td>
                  <td>{professor.areaAtuacao}</td>
                  <td>{formatarNumeroTelefone(professor.telefone)}</td>
                  <td>
                    <div className="flex items-center justify-center gap-5 my-2">
                      {/* MOLDAL EDITAR INICIO--------------------------- */}
                      <button
                        onClick={() => {
                          {
                            /* document.getElementById("my_modal_2").showModal();
                        atualizarProdBtnEditar(produto.id); */
                          }
                          router.push(`/professores/${professor.idprofessor}`);
                        }}
                        className="btn btn-info"
                      >
                        Editar
                      </button>

                      {/* MOLDAL EDITAR FIM--------------------------- */}
                      <button
                        onClick={() => removerProfessor(professor.idprofessor)}
                        className="btn btn-error"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-around mt-10">
            <Link href={"/"} className="hover:underline">
              Voltar a home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
