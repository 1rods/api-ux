--
-- PostgreSQL database dump
--

\restrict qvw2zbTLsOuoXR3HfVaO3hBarwT1XBeuqaIzYoOLKDRXK6QYdRt2agH3q2PKF8U

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2025-09-25 22:59:42

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 24591)
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    id integer NOT NULL,
    user_id integer NOT NULL,
    produto_id integer NOT NULL,
    qtd_produto_cart integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT cart_qtd_produto_cart_check CHECK ((qtd_produto_cart > 0))
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24590)
-- Name: cart_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_id_seq OWNER TO postgres;

--
-- TOC entry 4823 (class 0 OID 0)
-- Dependencies: 221
-- Name: cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_id_seq OWNED BY public.cart.id;


--
-- TOC entry 218 (class 1259 OID 16388)
-- Name: produtos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.produtos (
    id integer NOT NULL,
    id_produto character varying(50) NOT NULL,
    name_produto character varying(255) NOT NULL,
    qtd_produto integer NOT NULL,
    valor_produto numeric(10,2) NOT NULL,
    img_produto text,
    desc_produto text
);


ALTER TABLE public.produtos OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16387)
-- Name: produtos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.produtos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.produtos_id_seq OWNER TO postgres;

--
-- TOC entry 4824 (class 0 OID 0)
-- Dependencies: 217
-- Name: produtos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.produtos_id_seq OWNED BY public.produtos.id;


--
-- TOC entry 220 (class 1259 OID 24579)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(10) NOT NULL,
    email character varying,
    ativado boolean DEFAULT false,
    activation_token text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24578)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 4825 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4654 (class 2604 OID 24594)
-- Name: cart id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart ALTER COLUMN id SET DEFAULT nextval('public.cart_id_seq'::regclass);


--
-- TOC entry 4651 (class 2604 OID 16391)
-- Name: produtos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produtos ALTER COLUMN id SET DEFAULT nextval('public.produtos_id_seq'::regclass);


--
-- TOC entry 4652 (class 2604 OID 24582)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4817 (class 0 OID 24591)
-- Dependencies: 222
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart (id, user_id, produto_id, qtd_produto_cart, created_at) FROM stdin;
1	2	1	5	2025-09-24 11:06:47.995527
2	2	1	5	2025-09-24 11:21:32.456351
3	2	1	5	2025-09-24 11:21:56.398995
\.


--
-- TOC entry 4813 (class 0 OID 16388)
-- Dependencies: 218
-- Data for Name: produtos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.produtos (id, id_produto, name_produto, qtd_produto, valor_produto, img_produto, desc_produto) FROM stdin;
6	70069	novo produto	11	4.49	img.texte.png	nova descrição
1	P001	rodrigo	100	11.90	https://cdn.sistemawbuy.com.br/arquivos/a4456ac015133534fb513a1cb95ceb43/produtos/67008d67b40ea/tec-tom-3-6700941d8ca52.jpg	Descrição atualizada
2	P001	Teclado Mecânico reddragon	10	299.90	https://www.gigantec.com.br/media/catalog/product/cache/66c3fa0fb26d248d0ca40a64a387c3da/t/e/teclado-mecanico-gamer-redragon-lakshmi-02.jpg	Teclado mecânico switch azul
8	907204	250925	11	25.99	img.png	testando produto
\.


--
-- TOC entry 4815 (class 0 OID 24579)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, role, email, ativado, activation_token) FROM stdin;
3	teste	$2b$10$FBgDu6fX2jIvfQwMtG1I2OWbBc.Vwk/wYaNDetw/W9xXxTKKzgZHO	user	teste@teste.com	t	\N
1	admin	$2a$12$Z7AhHFwNJTw0QVkxSI/2U.Xun7EQvDS97Pg7spRpeqmJIlH30cQCm	admin	\N	t	\N
2	user	$2a$12$lilPXTjftIflmcGu1cXx6e0fY/suUWf8mxpu978esTMrrgiivmfrq	user	\N	t	\N
\.


--
-- TOC entry 4826 (class 0 OID 0)
-- Dependencies: 221
-- Name: cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_id_seq', 4, true);


--
-- TOC entry 4827 (class 0 OID 0)
-- Dependencies: 217
-- Name: produtos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.produtos_id_seq', 8, true);


--
-- TOC entry 4828 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- TOC entry 4664 (class 2606 OID 24598)
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (id);


--
-- TOC entry 4658 (class 2606 OID 16395)
-- Name: produtos produtos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produtos
    ADD CONSTRAINT produtos_pkey PRIMARY KEY (id);


--
-- TOC entry 4660 (class 2606 OID 24584)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4662 (class 2606 OID 24586)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4665 (class 2606 OID 24604)
-- Name: cart cart_produto_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES public.produtos(id) ON DELETE CASCADE;


--
-- TOC entry 4666 (class 2606 OID 24599)
-- Name: cart cart_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2025-09-25 22:59:43

--
-- PostgreSQL database dump complete
--

\unrestrict qvw2zbTLsOuoXR3HfVaO3hBarwT1XBeuqaIzYoOLKDRXK6QYdRt2agH3q2PKF8U

