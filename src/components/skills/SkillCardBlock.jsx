import {
  ReactOriginal,
  NextjsOriginal,
  JavascriptOriginal,
  MaterialuiOriginal,
  NodejsOriginal,
  MysqlOriginal,
  MongodbOriginal,
  PythonOriginal,
  GithubOriginal,
  GitOriginal,
  FigmaOriginal,
  TypescriptOriginal,
  ReduxOriginal,
  BootstrapOriginal,
  CplusplusOriginal,
  CsharpOriginal,
  Css3Original,
  GraphqlPlain,
  SqldeveloperOriginal,
  JiraOriginal,
  TailwindcssOriginal,
  ExpressOriginal,
  SlackPlain,
  PostmanOriginal,
  Html5Original,
  COriginal,
  PrismaOriginal,
  DartOriginal,
  FlutterOriginal,
  FirebaseOriginal,
  VuejsOriginal,
  NuxtjsOriginal,
  PhpOriginal,
  PostgresqlOriginal,
} from "devicons-react";
import { FaGithub } from "react-icons/fa";
import { SiShadcnui } from "react-icons/si";
import { motion } from "framer-motion";
import skill from "@/assets/skill.png";
import Image from "next/image";

// MySkills data  ---> MySkills is just a JavaScript object.--> {name: "React",icon: "ReactOriginal"}
//    ↓
// icon string ---> ReactOriginal" is just a STRING , It cannot render anything by itself --> const icon = "ReactOriginal" (Remember this name so we can find the real icon later)
//    ↓
// switch-case mapping ---> It converts the string into a real React component (If the string says ReactOriginal, use the ReactOriginal component)

// let IconComponent = null;
// switch (icon) {
//   case "ReactOriginal":
//     IconComponent = ReactOriginal; // component reference
//     break;
// }
//    ↓
// Devicon React component --->  ReactOriginal comes from "devicons-react", It is a React FUNCTION COMPONENT that returns SVG JSX (Now we have a real, executable React component)
// function ReactOriginal(props) {
//   return <svg>...</svg>;
// }
//    ↓
// Rendered icon ---> React sees a component and renders it to the DOM, <IconComponent className="scale-[150%]" />


// MySkills stores icon names as strings, the switch-case maps those strings to Devicon React components, and React renders the selected component as an SVG icon in the browser.


const SkillCardBlock = ({ icon, name }) => {
  let IconComponent = null;

  switch (icon) {
    case "ReactOriginal":
      IconComponent = ReactOriginal;
      break;

    case "COriginal":
      IconComponent = COriginal;
      break;
    case "NextjsOriginal":
      IconComponent = NextjsOriginal;
      break;

    case "PostmanOriginal":
      IconComponent = PostmanOriginal;
      break;
    case "ReduxOriginal":
      IconComponent = ReduxOriginal;
      break;
    case "Css3Original":
      IconComponent = Css3Original;
      break;
    case "TailwindcssOriginal":
      IconComponent = TailwindcssOriginal;
      break;
    case "ShadcnOriginal":
      IconComponent = SiShadcnui;
      break;
    case "PrismaOriginal":
      IconComponent = PrismaOriginal;
      break;
    case "FigmaOriginal":
      IconComponent = FigmaOriginal;
      break;
    case "BootstrapOriginal":
      IconComponent = BootstrapOriginal;
      break;
    case "JavascriptOriginal":
      IconComponent = JavascriptOriginal;
      break;
    case "MaterialuiOriginal":
      IconComponent = MaterialuiOriginal;
      break;
    case "NodejsOriginal":
      IconComponent = NodejsOriginal;
      break;
    case "ExpressOriginal":
      IconComponent = ExpressOriginal;
      break;

    case "MysqlOriginal":
      IconComponent = MysqlOriginal;
      break;

    case "MongodbOriginal":
      IconComponent = MongodbOriginal;
      break;

    case "PythonOriginal":
      IconComponent = PythonOriginal;
      break;

    case "CplusplusOriginal":
      IconComponent = CplusplusOriginal;
      break;
    case "CsharpOriginal":
      IconComponent = CsharpOriginal;
      break;
    case "SqldeveloperOriginal":
      IconComponent = SqldeveloperOriginal;
      break;
    case "GraphqlPlain":
      IconComponent = GraphqlPlain;
      break;
    case "GithubOriginal":
      IconComponent = FaGithub;
      break;
    case "GitOriginal":
      IconComponent = GitOriginal;
      break;
    case "JiraOriginal":
      IconComponent = JiraOriginal;
      break;
    case "Html5Original":
      IconComponent = Html5Original;
      break;
    case "TypescriptOriginal":
      IconComponent = TypescriptOriginal;
      break;
    case "DartOriginal":
      IconComponent = DartOriginal;
      break;
    // case "FlutterOriginal":
    //   IconComponent = FlutterOriginal;
    //   break;
    case "FirebaseOriginal":
      IconComponent = FirebaseOriginal;
      break;
    case "VueOriginal":
      IconComponent = VuejsOriginal;
      break;
    case "NuxtOriginal":
      IconComponent = NuxtjsOriginal;
      break;
    case "PhpOriginal":
      IconComponent = PhpOriginal;
      break;
    case "PostgresqlOriginal":
      IconComponent = PostgresqlOriginal;
      break;
    case "MysqlOriginal":
      IconComponent = MysqlOriginal;
      break;
    default:
      break;
  }

  return (
    <motion.div
      whileHover={{ scale: 1.08, backgroundColor: "rgba(59,130,246,0.08)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="rounded-md"
    >
      <div className="flex cursor-pointer flex-row items-center justify-evenly gap-3 rounded-md px-4 py-3 transition-all duration-150 ease-in-out hover:bg-gray-800 md:gap-4">
        {IconComponent ? (
          <div>
            <IconComponent className="scale-[150%]" />
          </div>
        ) : (
          <Image
            src={skill}
            alt="skill"
            width={20}
            height={20}
            className="-mr-1"
          />
        )}
        <div className="text-sm sm:text-base">{name}</div>
      </div>
    </motion.div>
  );
};

export default SkillCardBlock;
