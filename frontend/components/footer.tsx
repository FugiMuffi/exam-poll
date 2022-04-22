import styles from 'styles/Footer.module.scss'
import { FaGithub } from 'react-icons/fa'

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <span>
        Developed by <a href="https://github.com/FugiMuffi" target="_blank" rel="noreferrer">Fugi</a>{' '}
        and <a href="https://github.com/Trivo25" target="_blank" rel="noreferrer">Florian</a>{' '}
        on <a href="https://github.com/FugiMuffi/exam-poll" target="_blank" rel="noreferrer" className={styles.github}>Github <FaGithub/></a>
      </span>
    </footer>
  )
}

export default Footer
