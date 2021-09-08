CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 3068 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 724 (class 1247 OID 66901)
-- Name: Movies_classify_enum; Type: TYPE; Schema: public; Owner: quankhs
--

CREATE TYPE public."Movies_classify_enum" AS ENUM (
    'P',
    'C13',
    'C18'
);



--
-- TOC entry 705 (class 1247 OID 66704)
-- Name: Movies_status_enum; Type: TYPE; Schema: public; Owner: quankhs
--

CREATE TYPE public."Movies_status_enum" AS ENUM (
    'PLAYING',
    'UPCOMING',
    'OVER'
);



--
-- TOC entry 691 (class 1247 OID 66649)
-- Name: Users_gender_enum; Type: TYPE; Schema: public; Owner: quankhs
--

CREATE TYPE public."Users_gender_enum" AS ENUM (
    'MALE',
    'FEMALE',
    'ANOTHER'
);



--
-- TOC entry 694 (class 1247 OID 66656)
-- Name: Users_roles_enum; Type: TYPE; Schema: public; Owner: quankhs
--

CREATE TYPE public."Users_roles_enum" AS ENUM (
    'ADMIN',
    'USER',
    'GHOST'
);



SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 203 (class 1259 OID 66529)
-- Name: Genres; Type: TABLE; Schema: public; Owner: quankhs
--

CREATE TABLE public."Genres" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdDate" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedDate" timestamp with time zone DEFAULT now() NOT NULL,
    name character varying(30) NOT NULL
);



--
-- TOC entry 207 (class 1259 OID 66573)
-- Name: GroupTheater; Type: TABLE; Schema: public; Owner: quankhs
--

CREATE TABLE public."GroupTheater" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdDate" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedDate" timestamp with time zone DEFAULT now() NOT NULL,
    name character varying(30) NOT NULL,
    logo character varying NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);



--
-- TOC entry 217 (class 1259 OID 66711)
-- Name: Movies; Type: TABLE; Schema: public; Owner: quankhs
--

CREATE TABLE public."Movies" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdDate" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedDate" timestamp with time zone DEFAULT now() NOT NULL,
    title character varying(512) NOT NULL,
    "trailerVideoUrl" character varying(512) NOT NULL,
    "posterUrl" character varying(512) NOT NULL,
    "backdropUrl" character varying(512) NOT NULL,
    description text NOT NULL,
    "releaseDate" timestamp without time zone NOT NULL,
    duration integer NOT NULL,
    language character varying(32) NOT NULL,
    classify public."Movies_classify_enum" DEFAULT 'C13'::public."Movies_classify_enum" NOT NULL,
    status public."Movies_status_enum" DEFAULT 'OVER'::public."Movies_status_enum" NOT NULL,
    "voteCount" integer,
    "imdbRating" double precision,
    "tomatoesRating" integer,
    "isActive" boolean DEFAULT true NOT NULL,
    "voteAverage" double precision
);



--
-- TOC entry 204 (class 1259 OID 66539)
-- Name: People; Type: TABLE; Schema: public; Owner: quankhs
--

CREATE TABLE public."People" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdDate" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedDate" timestamp with time zone DEFAULT now() NOT NULL,
    "fullName" character varying NOT NULL,
    avatar character varying NOT NULL,
    "position" character varying,
    "isActive" boolean DEFAULT true NOT NULL
);



--
-- TOC entry 206 (class 1259 OID 66565)
-- Name: ProductOrders; Type: TABLE; Schema: public; Owner: quankhs
--

CREATE TABLE public."ProductOrders" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdDate" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedDate" timestamp with time zone DEFAULT now() NOT NULL,
    quantity integer NOT NULL,
    "reservationId" uuid NOT NULL,
    "productId" uuid NOT NULL
);



--
-- TOC entry 205 (class 1259 OID 66551)
-- Name: Products; Type: TABLE; Schema: public; Owner: quankhs
--

CREATE TABLE public."Products" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdDate" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedDate" timestamp with time zone DEFAULT now() NOT NULL,
    name character varying NOT NULL,
    description text NOT NULL,
    price integer NOT NULL,
    discount integer,
    image character varying NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);



--
-- TOC entry 218 (class 1259 OID 66725)
-- Name: Promotion; Type: TABLE; Schema: public; Owner: quankhs
--

CREATE TABLE public."Promotion" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdDate" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedDate" timestamp with time zone DEFAULT now() NOT NULL,
    code character varying(16) NOT NULL,
    name character varying NOT NULL,
    image character varying,
    discount integer DEFAULT 5 NOT NULL,
    "startDate" timestamp without time zone NOT NULL,
    "endDate" timestamp without time zone NOT NULL,
    "sumUsersUsed" integer NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);



--
-- TOC entry 212 (class 1259 OID 66626)
-- Name: Reservations; Type: TABLE; Schema: public; Owner: quankhs
--

CREATE TABLE public."Reservations" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdDate" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedDate" timestamp with time zone DEFAULT now() NOT NULL,
    "showtimeId" uuid NOT NULL,
    "userId" uuid NOT NULL,
    amount integer NOT NULL
);



--
-- TOC entry 216 (class 1259 OID 66682)
-- Name: Reviews; Type: TABLE; Schema: public; Owner: quankhs
--

CREATE TABLE public."Reviews" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdDate" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedDate" timestamp with time zone DEFAULT now() NOT NULL,
    content text,
    rating integer NOT NULL,
    "movieId" uuid NOT NULL,
    "authorId" uuid NOT NULL,
    title character varying NOT NULL
);



--
-- TOC entry 209 (class 1259 OID 66594)
-- Name: Seats; Type: TABLE; Schema: public; Owner: quankhs
--

CREATE TABLE public."Seats" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdDate" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedDate" timestamp with time zone DEFAULT now() NOT NULL,
    "row" character varying NOT NULL,
    "column" integer NOT NULL,
    type character varying NOT NULL,
    room character varying NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "theaterId" uuid NOT NULL
);



--
-- TOC entry 211 (class 1259 OID 66618)
-- Name: ShowTimes; Type: TABLE; Schema: public; Owner: quankhs
--

CREATE TABLE public."ShowTimes" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdDate" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedDate" timestamp with time zone DEFAULT now() NOT NULL,
    "startTime" timestamp without time zone NOT NULL,
    "endTime" timestamp without time zone NOT NULL,
    "movieId" uuid NOT NULL,
    "theaterId" uuid NOT NULL,
    room character varying NOT NULL
);



--
-- TOC entry 210 (class 1259 OID 66606)
-- Name: Theaters; Type: TABLE; Schema: public; Owner: quankhs
--

CREATE TABLE public."Theaters" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdDate" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedDate" timestamp with time zone DEFAULT now() NOT NULL,
    name character varying(512) NOT NULL,
    address character varying(512) NOT NULL,
    "phoneNumber" character varying NOT NULL,
    email character varying,
    rooms text NOT NULL,
    thumbnail character varying NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "groupTheaterId" uuid NOT NULL
);



--
-- TOC entry 208 (class 1259 OID 66585)
-- Name: Tickets; Type: TABLE; Schema: public; Owner: quankhs
--

CREATE TABLE public."Tickets" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdDate" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedDate" timestamp with time zone DEFAULT now() NOT NULL,
    price integer NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "showtimeId" uuid NOT NULL,
    "seatId" uuid,
    "reservationId" uuid
);



--
-- TOC entry 215 (class 1259 OID 66663)
-- Name: Users; Type: TABLE; Schema: public; Owner: quankhs
--

CREATE TABLE public."Users" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdDate" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedDate" timestamp with time zone DEFAULT now() NOT NULL,
    email character varying NOT NULL,
    "userName" character varying NOT NULL,
    password character varying NOT NULL,
    address character varying,
    "birthDate" timestamp without time zone,
    "phoneNumber" character varying,
    gender public."Users_gender_enum" DEFAULT 'MALE'::public."Users_gender_enum" NOT NULL,
    roles public."Users_roles_enum" DEFAULT 'USER'::public."Users_roles_enum" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "currentHashedRefreshToken" character varying,
    "isEmailConfirmed" boolean DEFAULT false NOT NULL,
    "avatarId" integer,
    "stripeCustomerId" character varying
);



--
-- TOC entry 220 (class 1259 OID 66745)
-- Name: movies_casts__people; Type: TABLE; Schema: public; Owner: quankhs
--

CREATE TABLE public.movies_casts__people (
    "moviesId" uuid NOT NULL,
    "peopleId" uuid NOT NULL
);



--
-- TOC entry 221 (class 1259 OID 66752)
-- Name: movies_crews__people; Type: TABLE; Schema: public; Owner: quankhs
--

CREATE TABLE public.movies_crews__people (
    "moviesId" uuid NOT NULL,
    "peopleId" uuid NOT NULL
);



--
-- TOC entry 219 (class 1259 OID 66738)
-- Name: movies_genres__genres; Type: TABLE; Schema: public; Owner: quankhs
--

CREATE TABLE public.movies_genres__genres (
    "moviesId" uuid NOT NULL,
    "genresId" uuid NOT NULL
);



--
-- TOC entry 214 (class 1259 OID 66639)
-- Name: public_file; Type: TABLE; Schema: public; Owner: quankhs
--

CREATE TABLE public.public_file (
    id integer NOT NULL,
    url character varying NOT NULL,
    key character varying NOT NULL
);



--
-- TOC entry 213 (class 1259 OID 66637)
-- Name: public_file_id_seq; Type: SEQUENCE; Schema: public; Owner: quankhs
--

CREATE SEQUENCE public.public_file_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 3069 (class 0 OID 0)
-- Dependencies: 213
-- Name: public_file_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: quankhs
--

ALTER SEQUENCE public.public_file_id_seq OWNED BY public.public_file.id;


--
-- TOC entry 2826 (class 2604 OID 66642)
-- Name: public_file id; Type: DEFAULT; Schema: public; Owner: quankhs
--

ALTER TABLE ONLY public.public_file ALTER COLUMN id SET DEFAULT nextval('public.public_file_id_seq'::regclass);
